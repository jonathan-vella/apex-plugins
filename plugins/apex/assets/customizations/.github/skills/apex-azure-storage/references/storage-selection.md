# Storage Selection

Use Blob Storage for object data, backup, and static content; Azure Files for managed SMB/NFS shares; Queues for simple
asynchronous work; Tables for basic key-value access; and Data Lake Storage for analytics with a hierarchical namespace.
Record a service alternative when SQL, Cosmos DB, Event Hubs, or Service Bus better fits the requirement.

Choose Standard unless an accepted latency or IOPS requirement supports Premium. Select Hot, Cool, Cold, or Archive
from the actual access and rehydration requirement. Lifecycle policy should transition or expire eligible objects using
an explicit age and access basis.

Select LRS for recreatable noncritical data, ZRS for zonal resiliency, and GRS/GZRS only when the accepted recovery
strategy requires regional replication. Redundancy does not itself establish backup, retention, RPO, or RTO.
