# Tag And Governance Precedence

Accepted governance constraints are the current authority for required tag keys, casing, values, inheritance, and
exceptions. Baseline tags are only a fallback when the task context explicitly establishes that no policy contract
exists.

## Decision Order

1. Confirm governance discovery is complete for inherited and target scopes.
2. Apply required keys, casing, values, exclusions, inheritance, and enforcement behavior from accepted constraints.
3. Always include the 9 lowercase resource-group tag keys (`environment`, `owner`, `costcenter`, `application`,
   `workload`, `sla`, `backup-policy`, `maint-window`, `technical-contact`) from
   [baseline fallbacks](baseline-fallbacks.md), using explicit user or governance values when provided and the
   runtime-resolved defaults otherwise.
4. Ensure `environment` is one of `alz`, `prod`, `test`, `dev` and `sla` is one of `critical`, `high`, `medium`, `low`
   (never `development` or non-policy literals).
5. Return a blocker only when an explicit live policy requires a custom key or restricted value that cannot be resolved
   from the project inputs or baseline defaults.

## Greenfield Decision Checklist

Apply this checklist when governance evidence reports no overriding tag policy at the target or any inherited scope:

1. Automatically adopt the lowercase nine-key contract and default value rules in
   [baseline fallbacks](baseline-fallbacks.md) without prompting the user to list tag keys.
2. Do not add a policy assignment to the design on the user's behalf. Record a recommendation to enact tag policy as a
   decision or plan item for the user to accept.
3. Record the tag contract source and evidence identifier in the typed artifact.

## Casing And Inheritance

- Use one casing for each logical key. Do not emit case variants such as `owner` and `Owner` together.
- Policy existence checks on tag keys are case-insensitive, but cost reporting, Resource Graph and SDK tag filters are
  case-sensitive. Mixed casing passes policy and still breaks cost allocation, so keep one casing per scope.
- Distinguish tags required on the resource group from tags required on child resources.
- Model `Modify` inheritance as expected behavior, but do not rely on it when a `Deny` requires the tag at creation.
- Preserve exemptions with scope and expiry. An exemption does not remove the requirement outside its scope.

## Existing Workloads

Preserve deployed casing and keys when drift evidence shows they are intentional and an accepted compatibility decision
requires them. Do not propagate a legacy convention, such as the deprecated PascalCase set, to new resources merely
because an older workload used it. Optional provenance tags such as `ManagedBy` are never required-contract keys.

## Output Constraint

Place tag intent, value source, propagation behavior, exception, and governance evidence identifier in the architecture
or binding decision. Do not query policy, create policy assignments, or write tags directly from this skill.
