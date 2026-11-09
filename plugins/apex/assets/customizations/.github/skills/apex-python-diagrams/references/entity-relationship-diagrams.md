# Entity Relationship Guidance

Reference-only: no current ERD producer/renderer is registered. Upstream Graphviz/SQLAlchemy models and Mermaid
examples are not installed introspection or rendering tools.

## Required Semantics

- Entity/table identity, attribute names and data types must come from an accepted schema, not example datasets.
- Distinguish primary, unique and foreign keys. Composite keys require all participating attributes and ordering.
- Label cardinality and optionality separately: one-to-one, one-to-many and many-to-many are not interchangeable.
- Represent many-to-many association through its accepted junction entity when that is the actual data model.
- Identify conceptual/document relationships versus enforced relational constraints; a Cosmos reference is not a SQL FK.
- Preserve cascade/restrict behavior, nullability and tenant boundaries only when they are established in the source.

| Relationship | Questions before drawing |
| --- | --- |
| One-to-one | Is either side optional? Which key enforces uniqueness? |
| One-to-many | Can a parent have zero children? Can a child have no parent? |
| Many-to-many | Is there an association entity with attributes or independent ownership? |
| Self-reference | Is recursion optional/bounded, and what prevents invalid cycles? |

Use a legend for key markers and crow's-foot notation. Keep table headings and attribute labels escaped and readable;
avoid connection strings, credentials, personal records, production data or sample secrets.

A future capability would need an approved schema source, bounded read-only metadata scope, deterministic key
relationships and a registered renderer. Do not install packages, connect to a database, run migrations or execute
an imported model to fill missing evidence. Report the missing producer/schema/renderer explicitly.
