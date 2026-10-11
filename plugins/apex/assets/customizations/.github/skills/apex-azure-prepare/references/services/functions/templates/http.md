> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# HTTP Function Templates

Default templates for HTTP-triggered Azure Functions. Use when no specific integration is detected.

## Templates by Runtime

| Runtime    | Template                                                |
| ---------- | ------------------------------------------------------- |
| C# (.NET)  | `azd init -t functions-quickstart-dotnet-azd`           |
| JavaScript | `azd init -t functions-quickstart-javascript-azd`       |
| TypeScript | `azd init -t functions-quickstart-typescript-azd`       |
| Python     | `azd init -t functions-quickstart-python-http-azd`      |
| Java       | `azd init -t azure-functions-java-flex-consumption-azd` |
| PowerShell | `azd init -t functions-quickstart-powershell-azd`       |

**Browse all:** [Awesome AZD Functions](https://azure.github.io/awesome-azd/?tags=functions)

## Evaluation Results

| Path                                         | Description                           |
| -------------------------------------------- | ------------------------------------- |
| [base/eval/summary.md](base/eval/summary.md) | Base HTTP template evaluation summary |
| [base/eval/python.md](base/eval/python.md)   | Python evaluation results             |
