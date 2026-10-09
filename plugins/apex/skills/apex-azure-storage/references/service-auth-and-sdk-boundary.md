# Storage Service, Authentication, And SDK Boundary

Use this reference to record storage design intent. It is not permission to access a storage account, install an SDK,
or create, read, upload, or delete data.

## Service And Lifecycle Intent

Select Blob for object data, backup, and static content; Files for managed SMB or NFS shares; Queues for simple
asynchronous work; Tables for basic key-value data; and Data Lake Storage for analytics requiring a hierarchical
namespace. Record an alternative when a database, eventing service, or messaging service better fits the workload.

Select Standard unless an accepted latency or IOPS requirement supports Premium. Choose Hot, Cool, Cold, or Archive
from actual access frequency and rehydration tolerance. A lifecycle policy must name the eligible object set, age or
access basis, action, and retention constraint; lifecycle transitions do not replace backup or retention design.

Select LRS for recreatable noncritical data, ZRS for zonal resiliency, and GRS or GZRS only when the recovery strategy
requires regional replication. Redundancy alone does not establish RPO, RTO, retention, or restore capability.

## Authentication Posture

Use managed identity and least-privilege Azure RBAC for Azure-hosted production workloads. For external production
workloads, record a deterministic workload-identity, federation, or certificate posture. Local development credentials
are not a production authentication design. Never include account keys, connection strings, credential values, or SDK
configuration in an APEX artifact.

Record the required data-plane role, identity owner, scope, network posture, and evidence needed for the selected
service. Missing classification, policy, network, or recovery evidence is a blocker.

## SDK Boundary

Language SDK installation, client construction, and data-operation samples remain implementation work outside this
skill. An authorized implementation capability must select libraries, acquire its own approved identity evidence, and
perform any data operation. This architecture reference supplies service and authentication intent only.
