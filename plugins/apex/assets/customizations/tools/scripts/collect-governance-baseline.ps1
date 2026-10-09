<#
.SYNOPSIS
    Collects Azure Policy assignments across all subscriptions under a
    Management Group or one subscription and writes a governance-baseline-v2 JSON.

.DESCRIPTION
    Authenticates via the workflow's azure/login@v2 context, discovers
    descendant subscriptions, collects policy assignments/definitions/
    set-definitions/exemptions per subscription, classifies findings,
    and writes a deterministic baseline.

    Every successful collection renews discovered_at timestamps,
    including unchanged subscriptions.

.PARAMETER ManagementGroupId
    The root Management Group ID to traverse; exclusive with SubscriptionId.

.PARAMETER SubscriptionId
    Collect one subscription, including inherited policy, without MG discovery.

.PARAMETER OutputDir
    Output directory for baseline files. Default: .github/data

.PARAMETER IncludeDefenderAuto
    Switch. If set, retains Defender-for-Cloud auto-assignments.

.PARAMETER IncludeDescendants
    Retain resource-group/resource assignments and scoped exemption evidence.

.PARAMETER MaxSubscriptions
    Maximum subscriptions to process. Default: 100.
#>
[CmdletBinding(DefaultParameterSetName = "ManagementGroup")]
param(
    [Parameter(Mandatory, ParameterSetName = "ManagementGroup")]
    [ValidateNotNullOrEmpty()]
    [ValidatePattern('\A[a-zA-Z0-9](?:[a-zA-Z0-9_().-]{0,88}[a-zA-Z0-9_()-])?\z')]
    [string]$ManagementGroupId,

    [Parameter(Mandatory, ParameterSetName = "Subscription")]
    [ValidatePattern('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$')]
    [string]$SubscriptionId,

    [string]$OutputDir = ".github/data",

    [switch]$IncludeDefenderAuto,
    [switch]$IncludeDescendants,

    [ValidateRange(1, [int]::MaxValue)]
    [int]$MaxSubscriptions = 100
)

# StrictMode intentionally omitted — REST API response objects have dynamic
# properties that vary per endpoint, and strict property access causes false
# failures. Error handling is via try/catch + ErrorActionPreference Stop.
$ErrorActionPreference = "Stop"

# ─── Constants ─────────────────────────────────────────────────────────────
$ARM = "https://management.azure.com"
$API_ASSIGNMENTS = "2022-06-01"
$API_DEFINITIONS = "2021-06-01"
$API_EXEMPTIONS = "2022-07-01-preview"
$API_MG_DESCENDANTS = "2020-05-01"

$BLOCKER_EFFECTS = @("Deny")
$AUTO_REMEDIATE_EFFECTS = @("DeployIfNotExists", "Modify")
$RELEVANT_EFFECTS = $BLOCKER_EFFECTS + $AUTO_REMEDIATE_EFFECTS
$DEFENDER_ASSIGNED_BY = @("Security Center", "Microsoft Defender for Cloud")

# ─── ARM Token ───────────────────────────────────────────────────────────────
function Get-ArmToken {
    $tokenJson = az account get-access-token --resource "$ARM" -o json 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $tokenJson) { throw "Failed to acquire ARM token via az account get-access-token" }
    $token = $tokenJson | ConvertFrom-Json
    if ([string]::IsNullOrWhiteSpace($token.accessToken)) { throw "ARM access token is empty" }
    return $token.accessToken
}

function Invoke-ArmRest {
    param([string]$Url, [string]$Token)
    $headers = @{ Authorization = "Bearer $Token"; "Content-Type" = "application/json" }
    $allValues = @()
    $currentUrl = $Url
    $visited = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    do {
        $requestUri = $null
        if (-not [uri]::TryCreate($currentUrl, [UriKind]::Absolute, [ref]$requestUri) -or
            $requestUri.Scheme -ne "https" -or $requestUri.Authority -ne ([uri]$ARM).Authority -or
            $requestUri.UserInfo -or $requestUri.Fragment) {
            throw "Invalid ARM pagination URL: $currentUrl"
        }
        if (-not $visited.Add($requestUri.AbsoluteUri)) { throw "Repeated ARM pagination URL: $currentUrl" }
        try {
            $response = Invoke-RestMethod -Uri $currentUrl -Headers $headers -Method Get -ErrorAction Stop
        }
        catch {
            throw "ARM REST call failed: $currentUrl - $_"
        }
        if ($null -eq $response -or $response.value -isnot [array]) {
            throw "Invalid ARM list response: $currentUrl"
        }
        $allValues += $response.value
        $nextLink = $response.nextLink
        if ($null -ne $nextLink -and $nextLink -isnot [string]) {
            throw "Invalid ARM nextLink: $currentUrl"
        }
        $currentUrl = $nextLink
    } while ($currentUrl)
    return $allValues
}

function Invoke-ArmRestSingle {
    param([string]$Url, [string]$Token)
    $headers = @{ Authorization = "Bearer $Token"; "Content-Type" = "application/json" }
    try {
        return Invoke-RestMethod -Uri $Url -Headers $headers -Method Get -ErrorAction Stop
    }
    catch {
        throw "ARM REST single fetch failed: $Url - $_"
    }
}

function Get-ArmPolicyDefinition {
    param([string]$Id, [hashtable]$Cache, [string]$ResourceType = "policyDefinitions")

    $idPattern = "^(?:/subscriptions/[^/?#]+|/providers/Microsoft.Management/managementGroups/[^/?#]+)?/providers/Microsoft.Authorization/$ResourceType/[^/?#]+$"
    if ($Id -notmatch $idPattern) { throw "Invalid $ResourceType resource ID: $Id" }
    $cacheKey = $Id.ToLowerInvariant()
    if (-not $Cache.ContainsKey($cacheKey)) {
        $Cache[$cacheKey] = Invoke-ArmRestSingle -Url "$ARM${Id}?api-version=$API_DEFINITIONS" -Token $Token
    }
    $definition = $Cache[$cacheKey]
    if ($null -eq $definition -or $definition.id -ine $Id -or $null -eq $definition.properties) {
        throw "Invalid $ResourceType response for $Id"
    }
    if ($ResourceType -eq "policySetDefinitions") {
        if ($definition.properties.policyDefinitions -isnot [array]) { throw "Invalid initiative members for $Id" }
    }
    elseif (-not $definition.properties.policyRule.then.effect) {
        throw "Missing policy effect for $Id"
    }
    return $definition
}

# ─── Classification ────────────────────────────────────────────────────────
function Get-EffectOf {
    param($Defn, $Parameters, $Initiative, $Assignment, $MemberRefId)
    $props = $Defn.properties
    $eff = $props.policyRule.then.effect
    $overridden = $false
    $appliedOverride = $null
    if ($null -ne $Assignment.properties.overrides -and $Assignment.properties.overrides -isnot [array]) {
        throw "Invalid assignment overrides"
    }
    foreach ($override in $Assignment.properties.overrides) {
        if ($override.kind -ne "policyEffect") { throw "Unsupported assignment override kind: $($override.kind)" }
        if ($null -ne $override.selectors -and $override.selectors -isnot [array]) { throw "Invalid policy effect override selectors" }
        $applies = $true
        foreach ($selector in $override.selectors) {
            if ($selector.kind -ne "policyDefinitionReferenceId" -or -not $Initiative) {
                throw "Unsupported policy effect override selector: $($selector.kind)"
            }
            if (($null -ne $selector.in -and $selector.in -isnot [array]) -or
                ($null -ne $selector.notIn -and $selector.notIn -isnot [array]) -or
                ($null -eq $selector.in -and $null -eq $selector.notIn)) {
                throw "Invalid policy effect override selector"
            }
            if ($null -ne $selector.in -and $MemberRefId -notin $selector.in) { $applies = $false }
            if ($null -ne $selector.notIn -and $MemberRefId -in $selector.notIn) { $applies = $false }
        }
        if ($applies) {
            if ($overridden) { throw "Overlapping policy effect overrides for $($Defn.id)" }
            $eff = $override.value
            $overridden = $true
            $appliedOverride = $override
        }
    }
    if (-not $overridden -and $eff -match "^\[parameters\('([^']+)'\)\]$") {
        $paramName = $Matches[1]
        $binding = if ($null -ne $Parameters) { $Parameters.PSObject.Properties[$paramName] } else { $null }
        if ($null -ne $binding) {
            $eff = $binding.Value.value
            if ($Initiative -and $eff -is [string] -and $eff -match "^\[parameters\('([^']+)'\)\]$") {
                $initiativeParamName = $Matches[1]
                $assignmentParameters = $Assignment.properties.parameters
                $assignmentBinding = if ($null -ne $assignmentParameters) { $assignmentParameters.PSObject.Properties[$initiativeParamName] } else { $null }
                if ($null -ne $assignmentBinding) { $eff = $assignmentBinding.Value.value }
                else { $eff = $Initiative.properties.parameters.$initiativeParamName.defaultValue }
            }
        }
        else { $eff = $props.parameters.$paramName.defaultValue }
    }
    if ($eff -isnot [string] -or $eff -notin @("Deny", "DeployIfNotExists", "Modify", "Disabled", "Audit", "AuditIfNotExists", "Append", "Manual", "DenyAction", "Mutate")) {
        throw "Unresolved or unsupported policy effect for $($Defn.id): $eff"
    }
    return @{ effect = [string]$eff; override = $appliedOverride }
}

function Get-Classification {
    param([string]$Effect)
    if ($BLOCKER_EFFECTS -contains $Effect) { return "blocker" }
    if ($AUTO_REMEDIATE_EFFECTS -contains $Effect) { return "auto-remediate" }
    return "informational"
}

function Get-EnforcementMode {
    param($Assignment)
    $property = $Assignment.properties.PSObject.Properties['enforcementMode']
    if ($null -eq $property) { return "Default" }
    $mode = $property.Value
    if ($mode -isnot [string] -or $mode -cnotin @("Default", "DoNotEnforce")) {
        throw "Unsupported assignment enforcementMode for $($Assignment.id)"
    }
    return $mode
}

function Test-IsDefenderAuto {
    param($Assignment)
    $props = $Assignment.properties
    if (-not $props) { return $false }
    if (-not $props.PSObject.Properties['metadata']) { return $false }
    $metadata = $props.metadata
    if (-not $metadata -or -not $metadata.PSObject.Properties['assignedBy']) { return $false }
    $assignedBy = $metadata.assignedBy
    if (-not $assignedBy) { return $false }
    return ($DEFENDER_ASSIGNED_BY -contains $assignedBy)
}

function Get-ResourceTypes {
    param($Defn)
    $types = @()
    $rule = $Defn.properties.policyRule
    if (-not $rule) { return $types }
    $ruleJson = $rule | ConvertTo-Json -Depth 20 -Compress
    $matches = [regex]::Matches($ruleJson, '"type"\s*:\s*"(Microsoft\.\w+/\w+(?:/\w+)?)"')
    foreach ($m in $matches) {
        $t = $m.Groups[1].Value
        if ($types -notcontains $t) { $types += $t }
    }
    return $types
}

function Get-RequiredValue {
    param($Defn)
    $rule = $Defn.properties.policyRule
    if (-not $rule) { return $null }
    $then = $rule.then
    if (-not $then -or -not $then.details) { return $null }
    $val = $then.details.value
    if ($null -ne $val) { return $val }
    $existCond = $then.details.existenceCondition
    if ($existCond) {
        $condJson = $existCond | ConvertTo-Json -Depth 10 -Compress
        $valMatch = [regex]::Match($condJson, '"(?:equals|in)"\s*:\s*(\[.*?\]|"[^"]*"|\d+|true|false)')
        if ($valMatch.Success) { return $valMatch.Groups[1].Value }
    }
    return $null
}

function Get-PropertyPaths {
    param($Defn, $ResourceTypes)
    $result = @{ azurePropertyPath = $null; bicepPropertyPath = $null; pathSemantics = $null }
    $rule = $Defn.properties.policyRule
    if (-not $rule) { return $result }
    $ruleJson = $rule | ConvertTo-Json -Depth 20 -Compress
    # Look for field conditions
    $fieldMatch = [regex]::Match($ruleJson, '"field"\s*:\s*"([^"]+)"')
    if ($fieldMatch.Success) {
        $field = $fieldMatch.Groups[1].Value
        if ($field -match '^Microsoft\.' -or $field -match '^\[') { return $result }
        if ($field -match 'tags\[') {
            $result.pathSemantics = "tag-policy-non-property"
            return $result
        }
        $result.azurePropertyPath = "properties.$field"
        $bicep = $field -replace '\.', '.'
        $result.bicepPropertyPath = $bicep
    }
    return $result
}

function Get-TagsRequired {
    param($Findings)
    $seen = @{}
    $tags = @()
    foreach ($f in $Findings) {
        $isTag = ($f.pathSemantics -eq "tag-policy-non-property") -or (($f.category -split '\s')[0] -ieq "Tags")
        if (-not $isTag) { continue }
        $params = $f.assignment_parameters
        $tagKeys = @()
        foreach ($pn in @("tagName", "tagname", "tag_name")) {
            if ($params -and $params.$pn) {
                $v = $params.$pn
                if ($v -is [string]) { $tagKeys += $v }
                elseif ($v -is [array]) { $tagKeys += $v }
            }
        }
        foreach ($pn in @("tagNames", "listOfTagNames", "tagnames")) {
            if ($params -and $params.$pn -and $params.$pn -is [array]) {
                $tagKeys += $params.$pn
            }
        }
        if ($tagKeys.Count -gt 0) {
            foreach ($key in $tagKeys) {
                $key = $key.Trim()
                if ($key -and -not $seen.ContainsKey($key)) {
                    $seen[$key] = $true
                    $tags += @{ name = $key; source_policy = $f.policy_id; source_assignment = $f.assignment_display_name }
                }
            }
        }
        else {
            $policyName = ($f.display_name -split '\s')[0..99] -join ' '
            if ($policyName -and -not $seen.ContainsKey($policyName)) {
                $seen[$policyName] = $true
                $tags += @{ name = "[unresolved: $policyName]"; source_policy = $f.policy_id; source_assignment = $f.assignment_display_name; unresolved = "true" }
            }
        }
    }
    return $tags
}

function Get-AllowedLocations {
    param($Findings)
    $locations = [System.Collections.Generic.HashSet[string]]::new()
    foreach ($f in $Findings) {
        $dn = ($f.display_name -replace '\s', ' ').ToLower()
        $cat = ($f.category -replace '\s', ' ').ToLower()
        $isLocation = ($dn -match 'location') -or ($dn -match 'region') -or ($cat -match 'location')
        if ($isLocation) {
            $rv = $f.required_value
            if ($rv -is [array]) { foreach ($v in $rv) { [void]$locations.Add([string]$v) } }
            elseif ($rv -is [string] -and $rv) { [void]$locations.Add($rv) }
        }
        $params = $f.assignment_parameters
        if ($params) {
            foreach ($pn in @("listOfAllowedLocations", "allowedLocations", "listofallowedlocations", "allowedlocations")) {
                if ($params.$pn -is [array]) {
                    foreach ($v in $params.$pn) { if ($v) { [void]$locations.Add([string]$v) } }
                }
            }
        }
    }
    return ($locations | Sort-Object)
}

# ─── Process a single subscription ──────────────────────────────────────────
function Process-Subscription {
    param([string]$SubId, [string]$Token)

    $base = "$ARM/subscriptions/$SubId/providers/Microsoft.Authorization"
    # Policy assignment and exemption names may contain inner spaces, for example "(ArcBox) Tag resources".
    $POLICY_RESOURCE_NAME = '[^/?#%\s\p{Cc}](?:[^/?#%\p{Cc}]*[^/?#%\s\p{Cc}])?'
    $scopePattern = if ($IncludeDescendants) { "(/subscriptions/$SubId(?:/resourceGroups/[^/?#%\s]+)?(?:/providers/[^/?#%\s]+(?:/[^/?#%\s]+/[^/?#%\s]+)+)*|/providers/Microsoft.Management/managementGroups/[^/?#%\s]+)" } else { '(/subscriptions/[0-9a-f-]{36}|/providers/Microsoft.Management/managementGroups/[^/?#\s]+)' }

    $scopeFilter = if ($IncludeDescendants) { "" } else { '$filter=atScope()&' }
    $assignments = Invoke-ArmRest -Url "$base/policyAssignments?${scopeFilter}api-version=$API_ASSIGNMENTS" -Token $Token
    $subDefs = Invoke-ArmRest -Url "$base/policyDefinitions?api-version=$API_DEFINITIONS" -Token $Token
    $subSets = Invoke-ArmRest -Url "$base/policySetDefinitions?api-version=$API_DEFINITIONS" -Token $Token
    $exemptions = Invoke-ArmRest -Url "$base/policyExemptions?${scopeFilter}api-version=$API_EXEMPTIONS" -Token $Token

    $defs = @{}
    foreach ($d in $subDefs) { $defs[($d.id).ToLower()] = $d }
    $sets = @{}
    foreach ($s in $subSets) { $sets[($s.id).ToLower()] = $s }

    # Build exemption map
    $exemptionMap = @{}
    $collectionTime = [DateTimeOffset]::UtcNow
    $expiredExemptionCount = 0
    foreach ($ex in $exemptions) {
        $exProps = $ex.properties
        if (-not $exProps -or -not $exProps.policyAssignmentId -or $exProps.exemptionCategory -notin @("Waiver", "Mitigated")) {
            throw "Invalid policy exemption"
        }
        if ($ex.id -isnot [string] -or $ex.id -notmatch "^$scopePattern/providers/Microsoft.Authorization/policyExemptions/$POLICY_RESOURCE_NAME\z") {
            throw "Invalid or unsupported policy exemption scope"
        }
        $exemptionScope = $Matches[1]
        if ($exProps.policyAssignmentId -isnot [string] -or $exProps.policyAssignmentId -notmatch "^$scopePattern/providers/Microsoft.Authorization/policyAssignments/$POLICY_RESOURCE_NAME\z") {
            throw "Invalid policy exemption assignment identity"
        }
        $assignmentScope = $Matches[1]
        if ($IncludeDescendants -and $assignmentScope -notmatch '^/providers/Microsoft.Management/' -and
            $exemptionScope -ine $assignmentScope -and -not $exemptionScope.StartsWith("$assignmentScope/", [StringComparison]::OrdinalIgnoreCase)) {
            throw "Policy exemption scope is outside its assignment"
        }
        if (-not ($IncludeDescendants -and $exemptionScope.StartsWith("/subscriptions/$SubId/", [StringComparison]::OrdinalIgnoreCase)) -and $exemptionScope -ine "/subscriptions/$SubId" -and
            ($exemptionScope -notmatch '^/providers/Microsoft.Management/managementGroups/' -or $exemptionScope -ine $assignmentScope)) {
            throw "Policy exemption scope does not cover the collected subscription"
        }
        if ($null -ne $exProps.expiresOn) {
            $expiresAt = [DateTimeOffset]::MinValue
            if ($exProps.expiresOn -is [datetime]) {
                if ($exProps.expiresOn.Kind -eq [DateTimeKind]::Unspecified) { throw "Invalid policy exemption expiresOn timezone" }
                $expiresAt = [DateTimeOffset]$exProps.expiresOn
            }
            elseif ($exProps.expiresOn -isnot [string] -or
                $exProps.expiresOn -notmatch '^\d{4}-\d{2}-\d{2}T.+(?:Z|[+-]\d{2}:\d{2})$' -or
                -not [DateTimeOffset]::TryParse($exProps.expiresOn, [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::None, [ref]$expiresAt)) {
                throw "Invalid policy exemption expiresOn"
            }
            if ($expiresAt -le $collectionTime) { $expiredExemptionCount++; continue }
        }
        if ($exProps.resourceSelectors) { throw "Unsupported policy exemption resourceSelectors" }
        if ($null -ne $exProps.policyDefinitionReferenceIds -and $exProps.policyDefinitionReferenceIds -isnot [array]) {
            throw "Invalid policy exemption member references"
        }
        $asgId = $exProps.policyAssignmentId.ToLower()
        $exemptionMap[$asgId] = @($exemptionMap[$asgId]) + @(@{
            id = $ex.id
            scope = $exemptionScope
            expiresOn = $exProps.expiresOn
            category = $exProps.exemptionCategory
            policyDefinitionReferenceIds = $exProps.policyDefinitionReferenceIds
        })
    }

    # Filter Defender auto-assignments
    $filteredDefender = @()
    $keptAssignments = @()
    $notScopeExcludedCount = 0
    $targetScope = "/subscriptions/$SubId"
    foreach ($a in $assignments) {
        if ($IncludeDescendants -and ($a.properties.scope -notmatch "^$scopePattern\z" -or $a.properties.scope -match '/\.{1,2}(?:/|$)')) {
            throw "Invalid policy assignment scope"
        }
        if ($a.id -isnot [string] -or $a.id -notmatch "^(.+)/providers/Microsoft.Authorization/policyAssignments/$POLICY_RESOURCE_NAME\z" -or
            $Matches[1] -ine $a.properties.scope) {
            throw "Invalid policy assignment identity"
        }
        $notScopes = $a.properties.notScopes
        if ($null -ne $notScopes -and $notScopes -isnot [array]) { throw "Invalid assignment notScopes" }
        $normalizedNotScopes = @(
            foreach ($excludedScope in $notScopes) {
                if ($excludedScope -isnot [string] -or $excludedScope -notmatch '^/(?:subscriptions/[0-9a-f-]{36}(?:/[^?#]+)?|providers/Microsoft.Management/managementGroups/[^/?#]+?)/?\z') {
                    throw "Invalid assignment notScopes entry"
                }
                $excludedScope.TrimEnd('/')
            }
        )
        if ($targetScope -in $normalizedNotScopes -or $a.properties.scope -in $normalizedNotScopes) {
            $notScopeExcludedCount++
            continue
        }
        foreach ($excludedScope in $normalizedNotScopes) {
            if ($excludedScope.StartsWith("$targetScope/", [StringComparison]::OrdinalIgnoreCase)) {
                throw "Partial subscription notScopes cannot be represented: $excludedScope"
            }
            if ($excludedScope -notmatch '^/subscriptions/') {
                throw "Unresolved management group notScopes: $excludedScope"
            }
        }
        if ($a.properties.resourceSelectors) { throw "Unsupported assignment resourceSelectors" }
        if ($null -ne $a.properties.PSObject.Properties['definitionVersion']) {
            throw "Unsupported assignment definitionVersion"
        }
        $null = Get-EnforcementMode $a
        if ((Test-IsDefenderAuto $a) -and -not $IncludeDefenderAuto -and -not $IncludeDescendants) {
            $filteredDefender += ($a.properties.displayName ?? $a.name ?? $a.id ?? "<unknown>")
        }
        else { $keptAssignments += $a }
    }

    $assignmentInventory = @()
    $findings = @()
    $auditCount = 0
    $disabledCount = 0
    $classifiedPolicyCount = 0
    $otherEffectCount = 0

    foreach ($a in $keptAssignments) {
        $props = $a.properties
        $display = $props.displayName ?? $a.name ?? $a.id ?? "<unknown>"
        $scope = $props.scope ?? ""
        $policyDefId = ($props.policyDefinitionId ?? "").ToLower()
        $assignmentId = ($a.id ?? "").ToLower()
        $assignmentType = if ($scope.ToLower() -match '/providers/microsoft.management/managementgroups/') { "management-group" } else { "subscription" }
        $enforcementMode = Get-EnforcementMode $a

        $assignmentInventory += @{
            assignmentId = $a.id
            displayName = $display
            scope = $scope
            assignmentType = $assignmentType
            policyDefinitionId = $policyDefId
            enforcementMode = $enforcementMode
        }

        if (-not $policyDefId) { throw "Missing policyDefinitionId for assignment $assignmentId" }

        # Resolve members
        $members = @()
        $policySet = $null
        if ($policyDefId -match '/policysetdefinitions/') {
            $policySet = Get-ArmPolicyDefinition -Id $policyDefId -Cache $sets -ResourceType "policySetDefinitions"
            foreach ($setMember in $policySet.properties.policyDefinitions) {
                if ($null -ne $setMember.PSObject.Properties['definitionVersion']) {
                    throw "Unsupported initiative member definitionVersion"
                }
                $memberDefinition = Get-ArmPolicyDefinition -Id $setMember.policyDefinitionId -Cache $defs
                $members += @{ defn = $memberDefinition; memberRefId = $setMember.policyDefinitionReferenceId; parameters = $setMember.parameters }
            }
        }
        else {
            $policyDefinition = Get-ArmPolicyDefinition -Id $policyDefId -Cache $defs
            $members += @{ defn = $policyDefinition; memberRefId = $null; parameters = $props.parameters }
        }

        foreach ($member in $members) {
            $defn = $member.defn
            $memberRefId = $member.memberRefId
            $effectivePolicy = Get-EffectOf -Defn $defn -Parameters $member.parameters -Initiative $policySet -Assignment $a -MemberRefId $memberRefId
            $eff = $effectivePolicy.effect
            $classifiedPolicyCount++
            if ($eff -eq "Disabled") { $disabledCount++; if (-not $IncludeDescendants) { continue } }
            if ($eff -in @("Audit", "AuditIfNotExists")) { $auditCount++; if (-not $IncludeDescendants) { continue } }
            if ($IncludeDescendants -and $eff -notin ($RELEVANT_EFFECTS + @("Disabled", "Audit", "AuditIfNotExists", "Append"))) { throw "Unsupported policy effect" }
            if (-not $IncludeDescendants -and $eff -notin $RELEVANT_EFFECTS) { $otherEffectCount++; continue }

            $rtypes = Get-ResourceTypes $defn
            $paths = Get-PropertyPaths $defn $rtypes
            $category = $defn.properties.metadata.category ?? "Uncategorized"

            $exemption = $null
            $reportedExemptions = @()
            if ($exemptionMap.ContainsKey($assignmentId)) {
                foreach ($candidate in $exemptionMap[$assignmentId]) {
                    if ($null -eq $candidate) { continue }
                    $refIds = $candidate.policyDefinitionReferenceIds
                    if (-not $refIds -or $memberRefId -in $refIds) {
                        $reportedExemptions += $candidate
                        if (-not $IncludeDescendants) {
                            $exemption = $candidate
                        }
                        if (-not $IncludeDescendants) { break }
                    }
                }
            }

            $classification = Get-Classification $eff
            if ($exemption) { $classification = "informational" }

            $effectLower = $eff.Substring(0,1).ToLower() + $eff.Substring(1)

            $finding = [ordered]@{
                policy_id = $defn.id
                display_name = $defn.properties.displayName ?? $defn.name ?? $defn.id
                effect = $effectLower
                enforcementMode = $enforcementMode
                scope = $scope
                assignment_display_name = $display
                assignment_id = $a.id
                classification = $classification
                category = $category
                resource_types = @($rtypes)
                required_value = (Get-RequiredValue $defn)
                azurePropertyPath = $paths.azurePropertyPath
                bicepPropertyPath = $paths.bicepPropertyPath
                exemption = $exemption
                override = $effectivePolicy.override
            }
            if ($policySet) { $finding.policyDefinitionReferenceId = $memberRefId }
            if ($IncludeDescendants) { $finding.reported_exemptions = @($reportedExemptions) }

            # Assignment parameters
            $assignmentParams = $props.parameters
            $paramValues = [ordered]@{}
            $parameterSource = if ($policySet) { $policySet } else { $defn }
            foreach ($parameter in $parameterSource.properties.parameters.PSObject.Properties) {
                if ($parameter.Value.PSObject.Properties['defaultValue']) {
                    $paramValues[$parameter.Name] = $parameter.Value.defaultValue
                }
            }
            foreach ($parameter in $assignmentParams.PSObject.Properties) {
                $paramValues[$parameter.Name] = $parameter.Value.value
            }
            if ($policySet) {
                $memberValues = [ordered]@{}
                foreach ($parameter in $defn.properties.parameters.PSObject.Properties) {
                    if ($parameter.Value.PSObject.Properties['defaultValue']) {
                        $memberValues[$parameter.Name] = $parameter.Value.defaultValue
                    }
                }
                foreach ($parameter in $member.parameters.PSObject.Properties) {
                    $val = $parameter.Value.value
                    if ($val -is [string] -and $val -match "^\[parameters\('([^']+)'\)\]$" -and $paramValues.Contains($Matches[1])) {
                        $val = $paramValues[$Matches[1]]
                    }
                    $memberValues[$parameter.Name] = $val
                }
                # A member's rule reads only its own parameters, already resolved from the initiative's values.
                # Storing every initiative parameter on every member made baselines too large to import.
                $paramValues = $memberValues
            }
            if ($paramValues.Count -gt 0) { $finding.assignment_parameters = $paramValues }
            if ($paths.pathSemantics) { $finding.pathSemantics = $paths.pathSemantics }
            $findings += $finding
        }
    }

    $blockerCount = @($findings | Where-Object { $_.classification -eq "blocker" }).Count
    $autoRemediateCount = @($findings | Where-Object { $_.classification -eq "auto-remediate" }).Count
    $exemptedCount = @($findings | Where-Object { $null -ne $_.exemption }).Count
    $infoCount = @($findings | Where-Object { $_.classification -eq "informational" }).Count
    $subScopeCount = ($keptAssignments | Where-Object { $_.properties.scope -and $_.properties.scope.ToLower() -notmatch '/providers/microsoft.management/' }).Count
    $mgInheritedCount = ($keptAssignments | Where-Object { $_.properties.scope -and $_.properties.scope.ToLower() -match '/providers/microsoft.management/' }).Count

    $tagsRequired = Get-TagsRequired $findings
    $allowedLocations = Get-AllowedLocations $findings

    # L0 attestation envelope (plan-optimiseGovernanceAgent.prompt.md Phase 3b).
    # We emit every field except `completeness_signature` here; the cached
    # renderer recomputes the signature via the canonical Python helper so
    # the cached path stays byte-identical to the live path for the same
    # upstream findings (F2 decision — single signature algorithm).
    $discoveredAtIso = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ" -AsUTC)
    $managementGroups = @(
        $keptAssignments
        | Where-Object { $_.properties.scope -and ($_.properties.scope.ToLower() -match '/providers/microsoft.management/managementgroups/') }
        | ForEach-Object {
            $marker = '/providers/microsoft.management/managementgroups/'
            $scope = $_.properties.scope.ToLower()
            ($scope -split [regex]::Escape($marker), 2)[1] -split '/', 2 | Select-Object -First 1
        }
        | Where-Object { $_ }
        | Select-Object -Unique
    )
    $discoveryMetadata = [ordered]@{
        discovery_status = "COMPLETE"
        discovered_at = $discoveredAtIso
        scope = [ordered]@{
            subscription_id = $SubId
            management_groups = @($managementGroups)
        }
        api_versions = [ordered]@{
            policyAssignments = $API_ASSIGNMENTS
            policyDefinitions = $API_DEFINITIONS
            policyExemptions = $API_EXEMPTIONS
        }
        page_counts = [ordered]@{
            policyAssignments = $assignments.Count
            policyDefinitions = $defs.Count
            policyExemptions = $exemptions.Count
        }
        # Left blank intentionally — render_cached_governance.py recomputes
        # this via the canonical _completeness_signature helper.
        completeness_signature = ""
        ttl_days = 30
    }
    if ($IncludeDescendants) { $discoveryMetadata.scope.coverage = "subscription-and-descendants-v1" }

    return [ordered]@{
        schema_version = "governance-constraints-v1"
        subscription_id = $SubId
        discovered_at = $discoveredAtIso
        source = "github-actions-baseline"
        discovery_status = "COMPLETE"
        discovery_metadata = $discoveryMetadata
        discovery_summary = [ordered]@{
            assignment_total = $assignments.Count
            assignment_kept = $keptAssignments.Count
            defender_auto_filtered = $filteredDefender.Count
            not_scope_excluded = $notScopeExcludedCount
            expired_exemption_count = $expiredExemptionCount
            subscription_scope_count = $subScopeCount
            management_group_inherited_count = $mgInheritedCount
            blocker_count = $blockerCount
            auto_remediate_count = $autoRemediateCount
            informational_count = $infoCount
            audit_count = $auditCount
            disabled_count = $disabledCount
            classified_policy_count = $classifiedPolicyCount
            other_effect_count = $otherEffectCount
            exempted_count = $exemptedCount
        }
        assignment_inventory = @($assignmentInventory)
        findings = @($findings)
        tags_required = @($tagsRequired)
        allowed_locations = @($allowedLocations)
    }
}

# ─── Main ────────────────────────────────────────────────────────────────────
$standalone = $PSCmdlet.ParameterSetName -eq "Subscription"
Write-Host "Governance Baseline Collector: $(if ($standalone) { $SubscriptionId } else { $ManagementGroupId })"

$token = Get-ArmToken
Write-Host "ARM token acquired"

# Discover descendant subscriptions
if ($standalone) {
    $allSubs = @([pscustomobject]@{ name = $SubscriptionId })
}
else {
    $descendantsUrl = "$ARM/providers/Microsoft.Management/managementGroups/$ManagementGroupId/descendants?api-version=$API_MG_DESCENDANTS"
    $descendants = Invoke-ArmRest -Url $descendantsUrl -Token $token
    $allSubs = @($descendants | Where-Object { $_.type -eq "Microsoft.Management/managementGroups/subscriptions" } | Sort-Object { $_.name })
    Write-Host "Discovered $($allSubs.Count) subscriptions under MG: $ManagementGroupId"
}

# Exclusion checks
$subscriptionsExcluded = @()
$eligibleSubs = @()
foreach ($sub in $allSubs) {
    $subId = $sub.name
    try {
        $subDetail = Invoke-RestMethod -Uri "$ARM/subscriptions/${subId}?api-version=2022-12-01" `
            -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } `
            -Method Get -ErrorAction Stop
    }
    catch {
        throw "Failed to read subscription $subId - $_"
    }
    $state = $subDetail.subscriptionPolicies.spendingLimit ?? $subDetail.state ?? "Unknown"
    if ($standalone -and $subDetail.state -ne "Enabled") {
        throw "Standalone subscription $subId is not enabled"
    }
    if ($subDetail.state -eq "Disabled") {
        $subscriptionsExcluded += [ordered]@{ subscription_id = $subId; reason = "disabled" }
        Write-Warning "Excluding $subId — disabled"
        continue
    }
    $quotaId = $subDetail.subscriptionPolicies.quotaId ?? ""
    if ($quotaId -like "AAD_*") {
        if ($standalone) { throw "Standalone subscription $subId has AAD quota: $quotaId" }
        $subscriptionsExcluded += [ordered]@{ subscription_id = $subId; reason = "AAD_quota"; quota_id = $quotaId }
        Write-Warning "Excluding $subId — AAD quota: $quotaId"
        continue
    }
    $eligibleSubs += $subId
}

# Apply cap
$subscriptionsSkipped = @()
$subsToProcess = $eligibleSubs
if ($eligibleSubs.Count -gt $MaxSubscriptions) {
    $subsToProcess = $eligibleSubs[0..($MaxSubscriptions - 1)]
    $subscriptionsSkipped = $eligibleSubs[$MaxSubscriptions..($eligibleSubs.Count - 1)]
    Write-Warning "Cap applied: processing $MaxSubscriptions of $($eligibleSubs.Count) eligible. Skipping $($subscriptionsSkipped.Count)."
}

$coverageStatus = if ($subscriptionsSkipped.Count -gt 0) { "PARTIAL" } else { "COMPLETE" }

$baselineFile = Join-Path $OutputDir "governance-policy-baseline.json"

# Process subscriptions
$subscriptions = [ordered]@{}
$totalProcessed = 0
$subIndex = 0
foreach ($subId in $subsToProcess) {
    $subIndex++
    Write-Host "Processing subscription ${subIndex}/$($subsToProcess.Count): $subId"
    try {
        $envelope = Process-Subscription -SubId $subId -Token $token
    }
    catch {
        throw "Failed to process subscription $subId - $_"
    }

    $subscriptions[$subId] = $envelope
    $totalProcessed++
}

# Build summary
$totalBlockers = 0
$totalAutoRemediate = 0
$totalFindings = 0
foreach ($sub in $subscriptions.Values) {
    $totalBlockers += $sub.discovery_summary.blocker_count
    $totalAutoRemediate += $sub.discovery_summary.auto_remediate_count
    $totalFindings += $sub.findings.Count
}

$baseline = [ordered]@{
    schema_version = "governance-baseline-v2"
    coverage_status = $coverageStatus
    subscriptions_discovered = $allSubs.Count
    subscriptions_processed = $totalProcessed
    subscriptions_skipped = @($subscriptionsSkipped)
    subscriptions_excluded = @($subscriptionsExcluded)
    summary = [ordered]@{
        total_findings = $totalFindings
        total_blockers = $totalBlockers
        total_auto_remediate = $totalAutoRemediate
        subscriptions_complete = $totalProcessed
    }
    subscriptions = $subscriptions
}
if ($standalone) { $baseline.subscription_id = $SubscriptionId }
else { $baseline.management_group_id = $ManagementGroupId }

# Write output
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
$baselineFile = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($baselineFile)
$stagingFile = Join-Path ([System.IO.Path]::GetDirectoryName($baselineFile)) ".governance-policy-baseline.$([guid]::NewGuid().ToString('N')).tmp"
try {
    $baselineJson = $baseline | ConvertTo-Json -Depth 50
    $baselineJson | Set-Content -LiteralPath $stagingFile -NoNewline
    [System.IO.File]::Move($stagingFile, $baselineFile, $true)
}
finally {
    [System.IO.File]::Delete($stagingFile)
}
Write-Host "Wrote baseline: $baselineFile"

# Write raw debug file (gitignored — not committed)
$rawFile = Join-Path $OutputDir "governance-policy-raw.json"
try {
    $baseline | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $rawFile -NoNewline
    Write-Host "Wrote raw debug: $rawFile (gitignored)"
}
catch {
    Write-Warning "Could not write optional raw debug file: $_" -WarningAction Continue
}

Write-Host "Done. Coverage: $coverageStatus | Processed: $totalProcessed | Excluded: $($subscriptionsExcluded.Count) | Skipped: $($subscriptionsSkipped.Count)"
