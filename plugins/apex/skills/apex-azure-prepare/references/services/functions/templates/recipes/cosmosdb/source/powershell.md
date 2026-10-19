> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Cosmos DB Trigger — PowerShell

## Trigger Function

Replace the HTTP trigger function with this Cosmos DB trigger.

### cosmosTrigger/function.json

```json
{
  "bindings": [
    {
      "type": "cosmosDBTrigger",
      "name": "documents",
      "direction": "in",
      "databaseName": "%COSMOS_DATABASE_NAME%",
      "containerName": "%COSMOS_CONTAINER_NAME%",
      "connection": "COSMOS_CONNECTION",
      "leaseContainerName": "leases",
      "createLeaseContainerIfNotExists": true
    }
  ]
}
```

### cosmosTrigger/run.ps1

```powershell
param($documents, $TriggerMetadata)

if ($documents.Count -gt 0) {
    Write-Host "Documents modified: $($documents.Count)"
    Write-Host "First document Id: $($documents[0].id)"

    foreach ($document in $documents) {
        Write-Host "Processing document: $($document.id)"
    }
}
```

## local.settings.json

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "powershell",
    "COSMOS_CONNECTION__accountEndpoint": "https://{accountName}.documents.azure.com:443/",
    "COSMOS_DATABASE_NAME": "documents-db",
    "COSMOS_CONTAINER_NAME": "documents"
  }
}
```

## Files to Remove from HTTP Base

- Remove the HTTP trigger function folder(s) (e.g., `httpget/`, `httppost/`)

## Common Patterns

- [Error Handling](../../common/error-handling.md) — Try/catch + logging patterns
- [Health Check](../../common/health-check.md) — Health endpoint for monitoring
- [UAMI Bindings](../../common/uami-bindings.md) — Managed identity settings
