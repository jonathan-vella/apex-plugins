# Storage CLI Commands

Azure CLI commands ported from the upstream `apex-azure-storage` skill. Data-plane commands use the signed-in Entra
identity (`--auth-mode login`), never account keys or SAS tokens.

## Command Routing

| Class | Commands | How it runs |
| --- | --- | --- |
| Read and diagnostic | `az storage account list`, `az storage account show`, `az storage container list`, `az storage blob list`, `az storage queue list`, `az storage table list`, `az storage share list`, `az storage fs list`, `az storage sku list` | Directly, against the approved account and scope |
| Reads that write local files | `az storage blob download` | Only with separate authorization for the exact blob and local path; never overwrite local files without it |
| Changes Azure | `az storage blob upload`, account, container, lifecycle, tier, network or redundancy changes, deletes | Never by the agent. Account and configuration changes ship in IaC through `apex preview`, the current runtime's Gate 4 and `apex deploy`; data writes are separate reviewed operations that need their own approval (a CI-owned production run with human approval verified before apply is a planned target, DECISION-036) |

Read output is an observation; storage decisions still cite accepted evidence from `apex/taskContext`.

## Services

| Service | Use when | CLI group |
| --- | --- | --- |
| Blob Storage | Objects, files, backups, static content | `az storage blob` |
| File Shares | SMB file shares, lift-and-shift | `az storage file` |
| Queue Storage | Asynchronous messaging, task queues | `az storage queue` |
| Table Storage | NoSQL key-value (consider Cosmos DB) | `az storage table` |
| Data Lake | Big data analytics, hierarchical namespace | `az storage fs` |

## Commands

```bash
# List storage accounts
az storage account list --output table

# List containers
az storage container list --account-name ACCOUNT --auth-mode login --output table

# List blobs
az storage blob list --account-name ACCOUNT --container-name CONTAINER --auth-mode login --output table
```

Downloading reads Azure but writes a local file. Run it only with separate authorization for the exact blob and target
path:

```bash
az storage blob download --account-name ACCOUNT --container-name CONTAINER --name BLOB --file LOCAL_PATH --auth-mode login
```

Uploading writes data into Azure:

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az storage blob upload --account-name ACCOUNT --container-name CONTAINER --name BLOB --file LOCAL_PATH --auth-mode login
```

## Access Requirements

These data-plane commands need a scoped data role for the signed-in identity: Storage Blob Data Reader for reads, or
Storage Blob Data Contributor for writes (held by the pipeline identity, not the agent). Management-plane Reader alone is
insufficient. Use `apex-azure-rbac` to choose the narrowest role and scope.

## Service Documentation

- Blob storage patterns and lifecycle: [Blob Storage documentation](https://learn.microsoft.com/azure/storage/blobs/storage-blobs-overview)
- File shares and Azure File Sync: [Azure Files documentation](https://learn.microsoft.com/azure/storage/files/storage-files-introduction)
- Queue patterns and poison handling: [Queue Storage documentation](https://learn.microsoft.com/azure/storage/queues/storage-queues-introduction)
