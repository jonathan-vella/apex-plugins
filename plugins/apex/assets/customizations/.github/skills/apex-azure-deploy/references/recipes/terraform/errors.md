> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Terraform Errors

| Error            | Resolution                                 |
| ---------------- | ------------------------------------------ |
| State lock error | Wait; confirm the lock is stale and no operation is running before any `force-unlock` |
| Resource exists  | `terraform import <resource>` is a state change needing its own approved operation |
| Backend denied   | Check storage permissions                  |
| Provider error   | Diagnose the error first; provider upgrades need a separate validated change |

## Cleanup (DESTRUCTIVE)

Destroy runs only from a kernel-created destroy preview (a saved destroy plan) with its own approval. Never use
`-auto-approve`, and a targeted destroy needs its own separately validated saved plan:

```bash
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
terraform plan -destroy -out=<approved-plan-file>
terraform apply <approved-plan-file>
```

⚠️ Permanently deletes resources.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/terraform/errors.md).
Load only the reference needed for the active task.
