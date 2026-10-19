# ADX Query Boundaries

Read [shared execution boundaries](../../apex-azure-deploy/references/execution-boundaries.md). The task must supply
the subscription/tenant, cluster/database/table scope, analytic question, time window, result limit and sensitivity
constraints. Use accepted schema evidence or scoped read-only discovery; never infer columns or broaden access.

Installed Kusto tools and direct `az` reads may collect observations. The `/v1/rest/query` REST POST is read-only
**only** for bounded query KQL. Verify the ADX data-plane token audience matches the target cloud/cluster; ARM
authentication does not establish database access. `Database Viewer`/`AllDatabasesViewer` are least-privilege
read candidates, not permission to assign roles. Forbidden fallbacks include management/ingestion endpoints,
`.set`, `.append`, `.ingest`, `.delete`, `.drop`, `.alter`, exports and cross-scope access.

A metadata/schema `.show` command is allowed only when authorized for that scope; other management commands do not
become “reads” because they use KQL syntax. Validate target and tool schemas; fallback does not evade denied access,
retry unbounded expensive queries or treat empty MCP responses as success.

Bound scans on both join inputs; filter early, project necessary columns and cap exploration. Do not log token
responses, query bodies containing sensitive values or unredacted result samples. Record query, target, producer,
time, hash, redactions, freshness and completeness, then submit through the task's evidence contract.

SDK/REST snippets do not grant cloud access or local result export. Missing schema, access, freshness or data-handling
support blocks the query. Anomaly models and correlations require validation, not causal claims. Cluster management,
retention, permissions and ingestion changes return to the owning task and trusted deployment.
