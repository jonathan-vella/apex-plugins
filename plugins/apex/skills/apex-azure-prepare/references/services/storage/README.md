> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Azure Storage

Scalable cloud storage for blobs, files, queues, and tables.

## When to Use

- Blob storage (files, images, videos)
- File shares (SMB/NFS)
- Queue storage (simple messaging)
- Table storage (NoSQL key-value)
- Static website hosting

## Required Supporting Resources

| Resource         | Purpose                   |
| ---------------- | ------------------------- |
| None required    | Storage is self-contained |
| Key Vault        | Store connection strings  |
| Private Endpoint | Secure access (optional)  |

## SKU Selection

| SKU          | Replication      | Use Case                |
| ------------ | ---------------- | ----------------------- |
| Standard_LRS | Local (3 copies) | Dev/test, non-critical  |
| Standard_ZRS | Zone-redundant   | Production, regional HA |
| Standard_GRS | Geo-redundant    | DR requirements         |
| Premium_LRS  | Premium SSD      | High performance        |

## Storage Types

| Type       | Best For                             |
| ---------- | ------------------------------------ |
| Blob       | Files, images, videos, backups, logs |
| Queue      | Simple message queuing, decoupling   |
| Table      | NoSQL key-value data                 |
| File Share | Lift-and-shift, SMB/NFS access       |

## Access Tiers

| Tier    | Use Case                     |
| ------- | ---------------------------- |
| Hot     | Frequent access              |
| Cool    | Infrequent access (30+ days) |
| Archive | Rare access (180+ days)      |

## Environment Variables

| Variable                  | Value          |
| ------------------------- | -------------- |
| `AZURE_STORAGE_ACCOUNT`   | Account name   |
| `AZURE_STORAGE_CONTAINER` | Container name |

Clients use Microsoft Entra ID and managed identity; no connection string or account key is part of the contract.

## References

- [Bicep Patterns](bicep.md)
- [Access Patterns](access.md)
