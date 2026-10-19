> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# SQL Database - SDK Patterns

## Node.js (mssql)

```javascript
const sql = require("mssql");

const config = {
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  authentication: {
    type: "azure-active-directory-default",
  },
  options: {
    encrypt: true,
  },
};

const pool = await sql.connect(config);
```

## Python (pyodbc)

> **Auth:** `DefaultAzureCredential` is for local development. See
> [auth-best-practices.md](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-entra-app-registration/references/auth-best-practices.md)
> for production patterns.

```python
import os
import struct

import pyodbc
from azure.identity import DefaultAzureCredential

SQL_COPT_SS_ACCESS_TOKEN = 1256  # ODBC pre-connect attribute for an Entra access token

credential = DefaultAzureCredential()
token = credential.get_token("https://database.windows.net/.default").token.encode("utf-16-le")
token_struct = struct.pack(f"<I{len(token)}s", len(token), token)

# Do not also set an Authentication= keyword; the token carries the identity (local developer or managed identity).
conn = pyodbc.connect(
    f"Driver={{ODBC Driver 18 for SQL Server}};"
    f"Server={os.environ['SQL_SERVER']};"
    f"Database={os.environ['SQL_DATABASE']};"
    f"Encrypt=yes",
    attrs_before={SQL_COPT_SS_ACCESS_TOKEN: token_struct},
)
```

## .NET (Entity Framework Core)

**Required NuGet Packages:**

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.Data.SqlClient --version 5.1.0
dotnet add package Azure.Identity
```

**Connection string (Entra ID):**

```text
Server=tcp:{server}.database.windows.net,1433;Database={database};Authentication=Active Directory Default;Encrypt=True;
```

**Configuration:**

```csharp
services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()
    ));
```

**appsettings.json:**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:myserver.database.windows.net,1433;Database=mydb;Authentication=Active Directory Default;Encrypt=True;"
  }
}
```

## Connection String Format

```text
Server=tcp:{server}.database.windows.net,1433;Database={database};Authentication=Active Directory Default;Encrypt=True;
```
