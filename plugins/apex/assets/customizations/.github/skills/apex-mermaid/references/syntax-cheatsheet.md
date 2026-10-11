<!-- ref:mermaid-syntax-cheatsheet-v1 -->

# Mermaid Syntax Cheat Sheet

## Flowcharts

```mermaid
graph TB
    A["Step 1"] --> B{"Decision"}
    B -->|"Yes"| C["Action"]
    B -->|"No"| D["Skip"]
```

- `graph TB` for vertical layouts; `graph LR` for horizontal.
- Use subgraphs for logical grouping:

```mermaid
graph TB
    subgraph "Resource Group"
        APP["App Service"]
        SQL["SQL Database"]
    end
    APP --> SQL
```

## Sequence Diagrams

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB
    Client->>API: Request
    API->>DB: Query
    DB-->>API: Result
    API-->>Client: Response
```

## Gantt Charts

```mermaid
gantt
    title Deployment Schedule
    dateFormat YYYY-MM-DD
    section Phase 1
        Task A :a1, 2026-01-01, 7d
        Task B :a2, after a1, 5d
```

## State Diagrams

```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Active: Approve
    Active --> Suspended: Suspend
    Suspended --> Active: Resume
    Active --> [*]: Complete
```

## ER Diagrams

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "ordered in"
```

## Azure Resource Visualization

Standalone architecture, network, runtime and as-built diagrams of live Azure resources use the kernel's Python
diagram path from accepted typed data, never Mermaid. The `apex-azure-resources` skill only interprets accepted
inventory evidence; it does not render diagrams or run Resource Graph queries. If that rendering capability or the
accepted inventory is unavailable, return the documented blocker instead of a Mermaid substitute.

### Inline Resource Relationship Conventions

Apply these only inside a registered, supported inline Markdown slot.

- Group by layer: Network, Compute, Data, Security, Monitoring
- Include resource details in node labels (use `<br/>` for line breaks)
- Label all connections descriptively
- Use subgraphs for logical grouping
- Connection types:
  - `-->` for data flow or dependencies
  - `-.->` for optional/conditional connections
  - `==>` for critical/primary paths

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-mermaid/references/syntax-cheatsheet.md).
Load only the reference needed for the active task.
