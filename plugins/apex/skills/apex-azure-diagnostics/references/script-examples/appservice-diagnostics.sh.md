> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# appservice-diagnostics.sh — Upstream Source Example

This is a non-executable source example, not an installed helper or a qualified deployment workflow. Do not copy
it into an active pipeline or run it. Native credentials, privileged diagnostics, remote mutations and local writes
need their owning task and capability. Script approval switches and CI environment approvals do not replace current Gate
4.

```bash
#!/usr/bin/env bash
# appservice-diagnostics.sh
# Collects diagnostic information for an Azure App Service web app in one pass
# and prints it as clearly labeled sections: app config, recent deployments,
# app settings, and custom domains. The script only gathers and labels output;
# it does not interpret the results.
#
# Usage:
#   ./appservice-diagnostics.sh --name <app> --resource-group <rg> [--subscription <id>]
#   ./appservice-diagnostics.sh <app> <rg> [subscription-id]
#
# Examples:
#   ./appservice-diagnostics.sh --name my-app --resource-group my-rg
#   ./appservice-diagnostics.sh my-app my-rg

set -euo pipefail

APP=""
RG=""
SUBSCRIPTION=""

usage() {
    echo "Usage: $0 --name <app> --resource-group <rg> [--subscription <id>]" >&2
}

# Requires a value to follow the given flag; errors out otherwise.
require_value() {
    if [ "$2" -lt 2 ]; then
        echo "Error: option '$1' requires a value." >&2
        usage
        exit 1
    fi
}

# Support both --flag and positional styles.
POSITIONAL=()
while [ $# -gt 0 ]; do
    case "$1" in
        --name|-n)             require_value "$1" "$#"; APP="$2"; shift 2 ;;
        --resource-group|-g)   require_value "$1" "$#"; RG="$2"; shift 2 ;;
        --subscription|-s)     require_value "$1" "$#"; SUBSCRIPTION="$2"; shift 2 ;;
        --*|-?)                echo "Error: unknown option '$1'." >&2; usage; exit 1 ;;
        *)                     POSITIONAL+=("$1"); shift ;;
    esac
done

if [ -z "$APP" ] && [ "${#POSITIONAL[@]}" -ge 1 ]; then APP="${POSITIONAL[0]}"; fi
if [ -z "$RG" ] && [ "${#POSITIONAL[@]}" -ge 2 ]; then RG="${POSITIONAL[1]}"; fi
if [ -z "$SUBSCRIPTION" ] && [ "${#POSITIONAL[@]}" -ge 3 ]; then SUBSCRIPTION="${POSITIONAL[2]}"; fi

if [ -z "$APP" ] || [ -z "$RG" ]; then
    usage
    exit 1
fi

SUB_ARGS=()
if [ -n "$SUBSCRIPTION" ]; then SUB_ARGS=(--subscription "$SUBSCRIPTION"); fi

echo "=== App Service Diagnostics: $APP (resource group: $RG) ==="
echo "Collecting app config, recent deployments, app settings, and custom domains."
echo ""

echo "--- App Config ---"
az webapp show -n "$APP" -g "$RG" "${SUB_ARGS[@]}" \
    --query "{state:state, runtime:siteConfig.linuxFxVersion, healthCheck:siteConfig.healthCheckPath, alwaysOn:siteConfig.alwaysOn}" \
    -o table || echo "(failed to read app config)"
echo ""

echo "--- Recent Deployments (last 3) ---"
az webapp deployment list -n "$APP" -g "$RG" "${SUB_ARGS[@]}" \
    --query "[:3].{id:id, status:status, time:end_time}" -o table || echo "(failed to list deployments)"
echo ""

echo "--- App Settings (names only) ---"
az webapp config appsettings list -n "$APP" -g "$RG" "${SUB_ARGS[@]}" \
    --query "[].name" -o tsv || echo "(failed to list app settings)"
echo ""

echo "--- Custom Domains ---"
az webapp config hostname list -g "$RG" --webapp-name "$APP" "${SUB_ARGS[@]}" -o table || echo "(failed to list custom domains)"
echo ""

echo "=== Diagnostics collection complete for $APP ==="
```

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/scripts/appservice-diagnostics.sh).
Load only the reference needed for the active task.
