> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Storage - Access Patterns

## Prerequisites for Granting Storage Access

> ⚠️ **Important**: To assign storage roles to managed identities, you need:
>
> - **User Access Administrator** or **Owner** role on the Storage Account (or parent resource group/subscription)
> - The role must include the `Microsoft.Authorization/roleAssignments/write` permission

**Common scenarios**:

- Granting Storage Blob Data Owner to a Web App or Function App's managed identity (System Assigned or User Assigned)
- Adding read/write access to blobs, queues, and tables for application workloads
- Allowing user identities (developers, data admins) access in dev/test environments
- Allowing applications to access storage using managed identity instead of connection strings

**Scope best practices**:

- Grant roles at the **smallest scope possible** (e.g., specific storage account, not resource group or subscription)
- Avoid broad scopes (Resource Group, Subscription, Tenant) unless absolutely necessary
- Prefer resource-level assignments for production workloads

**Managed identity types**:

- **System Assigned**: Automatically created with the resource (Web App, Function). Default when using `DefaultAzureCredential`.
- **User Assigned**: Standalone identity that can be shared across resources. Requires additional configuration:
  - Set `AZURE_CLIENT_ID` app setting to the User Assigned Managed Identity's client ID
  - Configure identity in Bicep with both `type: 'SystemAssigned, UserAssigned'` and `userAssignedIdentities`

If you encounter `AuthorizationFailed` errors when assigning roles, ensure you have User Access Administrator or Owner
permissions at the target scope.

## Managed Identity Role Assignment

```bicep
resource storageRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.id, principalId, 'Storage Blob Data Contributor')
  scope: storageAccount
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')
    principalId: principalId
    principalType: 'ServicePrincipal'
  }
}
```

## Storage Roles

| Role                           | Permissions       |
| ------------------------------ | ----------------- |
| Storage Blob Data Reader       | Read blobs        |
| Storage Blob Data Contributor  | Read/write blobs  |
| Storage Queue Data Contributor | Read/write queues |
| Storage Table Data Contributor | Read/write tables |

## SDK Connection Patterns

The baseline disables shared-key access, so clients authenticate with Microsoft Entra ID and the accepted Storage
data-plane roles. Do not use account keys or `AZURE_STORAGE_CONNECTION_STRING` for new work.

### Node.js

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

const blobServiceClient = new BlobServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
  new DefaultAzureCredential()
);
const containerClient = blobServiceClient.getContainerClient("uploads");
```

### Python

```python
import os
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

blob_service_client = BlobServiceClient(
    account_url=f"https://{os.environ['AZURE_STORAGE_ACCOUNT']}.blob.core.windows.net",
    credential=DefaultAzureCredential(),
)
container_client = blob_service_client.get_container_client("uploads")
```

### .NET

```csharp
var blobServiceClient = new BlobServiceClient(
    new Uri($"https://{Environment.GetEnvironmentVariable("AZURE_STORAGE_ACCOUNT")}.blob.core.windows.net"),
    new DefaultAzureCredential()
);
var containerClient = blobServiceClient.GetBlobContainerClient("uploads");
```

## Managed Identity Access

Use `DefaultAzureCredential` for local development (in production, use `ManagedIdentityCredential` — see [auth-best-practices.md](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-entra-app-registration/references/auth-best-practices.md)):

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

const client = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, new DefaultAzureCredential());
```
