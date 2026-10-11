# Azure CLI Commands for App Registration

Reference for managing Microsoft Entra app registrations with the Azure CLI, ported in full from the upstream
`cli-commands.md`, with the troubleshooting and permission-lookup commands from `troubleshooting.md` and
`api-permissions.md`.

## Command Routing

| Class | Commands | How it runs |
| --- | --- | --- |
| Local client setup | `az version`, `az login`, `az account set` | Directly; changes only the local CLI |
| Read and diagnostic | `az ad app list`, `az ad app show`, `az ad app credential list`, `az ad app permission list`, `az ad app owner list`, `az ad sp list`, `az ad sp show`, `az ad user show`, `az ad user list`, `az ad signed-in-user show`, `az account show` | Directly, for the intended tenant. Never print credential values, tokens or `--debug` output |
| Changes Entra ID | `az ad app create`, `az ad app update`, `az ad app delete`, `az ad app credential reset`, `az ad app credential delete`, `az ad app permission add`, `az ad app permission admin-consent`, `az ad app permission delete`, `az ad sp create`, `az ad sp delete`, `az ad app owner add`, `az ad app owner remove` | Never by the agent. The registration ships as Microsoft Graph Bicep through `apex preview`, the current runtime's Gate 4 and `apex deploy` (see [Graph Bicep example](graph-bicep-example.md); a CI-owned production run with human approval verified before apply is a planned target, DECISION-036). Admin consent stays an authorized owner's decision |

Read output is an observation; identity design still cites accepted capability receipts. Commands that change Entra ID
are marked `# Changes Azure`; the CLI forms document the operation and the shape of an approved pipeline step.

## Prerequisites

```bash
# Ensure Azure CLI is installed
az version

# Sign in to Azure (the user, for the intended tenant)
az login

# Set default subscription (optional)
az account set --subscription "<subscription-name-or-id>"
```

## App Registration Management

### Create App Registration

**Basic app registration:**

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app create --display-name "MyApplication"
```

**Web application with redirect URI:**

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app create \
  --display-name "MyWebApp" \
  --web-redirect-uris "https://myapp.com/callback" \
  --sign-in-audience "AzureADMyOrg"
```

**Single Page Application (SPA):**

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app create \
  --display-name "MySpaApp" \
  --spa-redirect-uris "http://localhost:3000" \
  --sign-in-audience "AzureADMyOrg"
```

**Public client (Desktop/Mobile app):**

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app create \
  --display-name "MyDesktopApp" \
  --public-client-redirect-uris "http://localhost" \
  --sign-in-audience "AzureADMyOrg"
```

**Multi-tenant application:**

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app create \
  --display-name "MyMultiTenantApp" \
  --web-redirect-uris "https://myapp.com/callback" \
  --sign-in-audience "AzureADMultipleOrgs"
```

### Sign-in Audience Options

| Value                                | Description                                |
| ------------------------------------ | ------------------------------------------ |
| `AzureADMyOrg`                       | Single tenant (default)                    |
| `AzureADMultipleOrgs`                | Multi-tenant (any Azure AD)                |
| `AzureADandPersonalMicrosoftAccount` | Multi-tenant + personal Microsoft accounts |
| `PersonalMicrosoftAccount`           | Personal Microsoft accounts only           |

## List and Query Apps

### List all app registrations

```bash
az ad app list --output table
```

### List apps with custom query

```bash
# Filter by display name
az ad app list --display-name "MyApp" --output table

# Get specific fields
az ad app list --query "[].{Name:displayName, AppId:appId}" --output table
```

### Get app details

```bash
# By display name
az ad app show --id $(az ad app list --display-name "MyApp" --query "[0].appId" -o tsv)

# By application ID
az ad app show --id "YOUR_APPLICATION_ID"
```

### Get Application (Client) ID

```bash
APP_ID=$(az ad app list --display-name "MyApp" --query "[0].appId" -o tsv)
echo "Application ID: $APP_ID"
```

### Get Object ID

```bash
OBJECT_ID=$(az ad app list --display-name "MyApp" --query "[0].id" -o tsv)
echo "Object ID: $OBJECT_ID"
```

## Update App Registration

### Add redirect URIs

**Web app:**

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app update --id $APP_ID \
  --web-redirect-uris "https://myapp.com/callback" "https://myapp.com/auth"
```

**SPA:**

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app update --id $APP_ID \
  --spa-redirect-uris "http://localhost:3000" "http://localhost:5000"
```

**Public client:**

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app update --id $APP_ID \
  --public-client-redirect-uris "http://localhost" "myapp://auth"
```

## Client Credentials (Secrets & Certificates)

### Create client secret

Require explicit approval for the intended tenant, application ID, credential type and expiry. Prefer federated identity
or certificates; they avoid this command entirely. The agent never runs it and never sees the value. Upstream frames it
as a user-run private-terminal operation; APEX does not use that path. In APEX it would run only as a reviewed step
that stores the value directly in Key Vault, after its own approval, and no supported route exists today:

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app credential reset --id "$APP_ID" --append --years 1
```

The command returns a new secret once. The user must transfer it directly to an
approved secret store outside chat/tool output and logs. Do not ask for the value,
print it in reports, or use `--debug`. If no private handoff exists, stop before
creation. Do not suppress the only copy with `--output none` and create an unusable secret.

`--append` preserves existing credentials. Record credential metadata before and
after, validate the new credential with the intended client, and only then seek
separate approval to retire an exact old key ID. Replacement without `--append`
removes existing credentials and requires explicit replacement approval and a
consumer migration/recovery plan; it is never an additive rotation fallback.

### List client credentials

```bash
# Snapshot secret metadata
az ad app credential list --id "$APP_ID" --query "[].{keyId:keyId,displayName:displayName,startDateTime:startDateTime,endDateTime:endDateTime}" --output json

# Snapshot certificate metadata separately
az ad app credential list --id "$APP_ID" --cert --query "[].{keyId:keyId,displayName:displayName,startDateTime:startDateTime,endDateTime:endDateTime}" --output json
```

### Delete client secret

```bash
# Get key ID from credential list
az ad app credential list --id "$APP_ID" --query "[].{KeyId:keyId,Name:displayName}" -o table

# Delete specific credential
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app credential delete --id "$APP_ID" --key-id "APPROVED_OLD_KEY_ID"
```

For a certificate, list with `--cert` and use `--cert` on deletion of its separately
approved key ID. Never delete by display name or retire credentials before consumer validation.

### Upload certificate

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
# Upload certificate from file
az ad app credential reset --id "$APP_ID" --append --cert "@path/to/public-cert.pem" --output none
```

Upload only the public certificate after explicit approval. Keep its private key
outside the repository and tool output; preserve existing credentials during validation.

## API Permissions

### Add API permissions

**Microsoft Graph User.Read:**

```bash
GRAPH_RESOURCE_ID="00000003-0000-0000-c000-000000000000"  # Microsoft Graph
USER_READ_ID="e1fe6dd8-ba31-4d61-89e7-88639da4683d"      # User.Read permission

# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app permission add --id $APP_ID \
  --api $GRAPH_RESOURCE_ID \
  --api-permissions "$USER_READ_ID=Scope"
```

**Microsoft Graph Mail.Read (delegated):**

```bash
MAIL_READ_ID="570282fd-fa5c-430d-a7fd-fc8dc98a9dca"      # Mail.Read permission

# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app permission add --id $APP_ID \
  --api $GRAPH_RESOURCE_ID \
  --api-permissions "$MAIL_READ_ID=Scope"
```

**Microsoft Graph User.Read.All (application):**

```bash
USER_READ_ALL_ID="df021288-bdef-4463-88db-98f22de89214"  # User.Read.All application permission

# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app permission add --id $APP_ID \
  --api $GRAPH_RESOURCE_ID \
  --api-permissions "$USER_READ_ALL_ID=Role"
```

**Note:** Use `Scope` for delegated permissions, `Role` for application permissions.

### Common Permission IDs

**Microsoft Graph (00000003-0000-0000-c000-000000000000):**

| Permission         | ID                                   | Type        |
| ------------------ | ------------------------------------ | ----------- |
| User.Read          | e1fe6dd8-ba31-4d61-89e7-88639da4683d | Delegated   |
| User.ReadWrite     | b4e74841-8e56-480b-be8b-910348b18b4c | Delegated   |
| Mail.Read          | 570282fd-fa5c-430d-a7fd-fc8dc98a9dca | Delegated   |
| Mail.Send          | e383f46e-2787-4529-855e-0e479a3ffac0 | Delegated   |
| Calendars.Read     | 465a38f9-76ea-45b9-9f34-9e8b0d4b0b42 | Delegated   |
| User.Read.All      | df021288-bdef-4463-88db-98f22de89214 | Application |
| Directory.Read.All | 7ab1d382-f21e-4acd-a863-ba3e13f7da61 | Application |

### Grant admin consent

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
# Grant admin consent for all permissions
az ad app permission admin-consent --id $APP_ID
```

**Note:** Admin consent is required for application permissions and some delegated permissions.

### List permissions

```bash
az ad app permission list --id $APP_ID
```

### Delete permission

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
# Remove specific permission
az ad app permission delete --id $APP_ID \
  --api $GRAPH_RESOURCE_ID \
  --permission-id $USER_READ_ID
```

## Service Principal Management

### Create service principal

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
# Create service principal for the app
az ad sp create --id $APP_ID
```

### List service principals

```bash
az ad sp list --display-name "MyApp"
```

### Get service principal details

```bash
az ad sp show --id $APP_ID
```

### Delete service principal

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad sp delete --id $APP_ID
```

## App Roles and Claims

### Get app roles

```bash
az ad app show --id $APP_ID --query "appRoles"
```

### Get optional claims

```bash
az ad app show --id $APP_ID --query "optionalClaims"
```

## Owners

### List app owners

```bash
az ad app owner list --id $APP_ID
```

### Add owner

```bash
# Add user as owner
USER_OBJECT_ID=$(az ad user show --id "user@domain.com" --query "id" -o tsv)
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app owner add --id $APP_ID --owner-object-id $USER_OBJECT_ID
```

### Remove owner

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az ad app owner remove --id $APP_ID --owner-object-id $USER_OBJECT_ID
```

## Delete App Registration

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
# Delete app registration (and associated service principal)
az ad app delete --id $APP_ID
```

## Tenant and Identity Information

### Get tenant ID

```bash
az account show --query tenantId -o tsv
```

### Get current user information

```bash
az ad signed-in-user show
```

### Get user by email

```bash
az ad user show --id "user@domain.com"
```

### Get user object ID

```bash
az ad user show --id "user@domain.com" --query "id" -o tsv
```

### List all users

```bash
az ad user list --output table
```

## Scripting Examples

### Complete app setup script

```bash
#!/bin/bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.

# Variables
APP_NAME="MyApplication"
REDIRECT_URI="http://localhost:3000"

echo "Creating app registration..."
APP_ID=$(az ad app create \
  --display-name "$APP_NAME" \
  --spa-redirect-uris "$REDIRECT_URI" \
  --query "appId" -o tsv)

echo "App created with ID: $APP_ID"

echo "Adding Microsoft Graph permissions..."
GRAPH_RESOURCE_ID="00000003-0000-0000-c000-000000000000"
USER_READ_ID="e1fe6dd8-ba31-4d61-89e7-88639da4683d"

az ad app permission add --id $APP_ID \
  --api $GRAPH_RESOURCE_ID \
  --api-permissions "$USER_READ_ID=Scope"

echo "Granting admin consent..."
az ad app permission admin-consent --id $APP_ID

echo "Creating service principal..."
az ad sp create --id $APP_ID

TENANT_ID=$(az account show --query tenantId -o tsv)

echo ""
echo "App registration complete!"
echo "Application (Client) ID: $APP_ID"
echo "Tenant ID: $TENANT_ID"
echo "Redirect URI: $REDIRECT_URI"
```

### Cleanup script

The preview half only lists apps. Deletion needs the owner's approval for the listed apps and runs through the
routed path, never by the agent. Deleted registrations can be restored for 30 days.

```bash
#!/bin/bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
set -euo pipefail
PREFIX="${1:?Usage: cleanup.sh <display-name-prefix> [--confirm]}"
FILTER="startswith(displayName,'${PREFIX//\'/\'\'}')"

mapfile -t APPS < <(az ad app list --filter "$FILTER" --all --query "[].[appId, displayName]" -o tsv)
if [[ ${#APPS[@]} -eq 0 ]]; then
  echo "No app registrations start with '$PREFIX'."
  exit 0
fi
printf 'Would delete: %s\n' "${APPS[@]}"

if [[ "${2:-}" != "--confirm" ]]; then
  echo "Preview only. Re-run with --confirm after approval."
  exit 0
fi

for APP in "${APPS[@]}"; do
  echo "Deleting app: $APP"
  az ad app delete --id "${APP%%$'\t'*}"
done
```

## Troubleshooting Commands

| Symptom | Read-only check | Routed fix |
| --- | --- | --- |
| Redirect URI mismatch | `az ad app show --id $APP_ID --query "{web:web.redirectUris,spa:spa.redirectUris,public:publicClient.redirectUris}"` | `az ad app update --id $APP_ID --web-redirect-uris ...` on the correct platform |
| Expired credential | `az ad app credential list --id $APP_ID` | Additive rotation per [client credentials](#client-credentials-secrets--certificates) |
| Consent required | `az ad app permission list --id $APP_ID` (`consentType: "AllPrincipals"` means admin consented) | `az ad app permission admin-consent --id $APP_ID`, by an authorized admin |
| Wrong application or tenant | `az ad app list --display-name "MyApp" --query "[].{Name:displayName, AppId:appId}"` and `az account show --query tenantId -o tsv` | Correct the client configuration |
| No service principal in the tenant | `az ad sp show --id $APP_ID` | `az ad sp create --id $APP_ID` |

Look up every Microsoft Graph permission ID (long output):

```bash
az ad sp list --filter "appId eq '00000003-0000-0000-c000-000000000000'" \
  --query "[0].{delegated:oauth2PermissionScopes,application:appRoles}" -o json
```
