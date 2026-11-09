> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Azure VM Connectivity Troubleshooting

Primary compute troubleshooting guide for incidents routed from [../../SKILL.md](../../SKILL.md). Use for Azure VM
RDP/SSH failures, NSG/firewall blocks, credential resets, and VM agent/tooling issues.

## Quick Reference

| Property | Details |
| --- | --- |
| Best for | RDP/SSH failures, port 3389/22 timeouts, black screen, credential reset, VM agent issues |
| Primary tools | Verified read commands in `apex-azure/compute`, `apex-azure/resourcehealth`, `apex-azure/monitor` |
| Router | [references/cannot-connect-to-vm.md](references/cannot-connect-to-vm.md) |

## MCP Tools

| Tool | Purpose |
| --- | --- |
| `apex-azure/compute` | VM state and metadata exposed by verified read commands |
| `apex-azure/resourcehealth` | Platform health before deeper diagnosis |
| `apex-azure/monitor` | Logs/metrics when workspace or resource scope is known |
| `apex-azure/documentation` | Current Microsoft Learn guidance for the matched symptom |

## When to Use

- "can't connect to my VM", "can't RDP", "can't SSH"
- RDP/SSH timeout, refused, black screen, internal error, session drop
- reset VM password, wrong credentials, access denied
- NSG, guest firewall, port 3389/22, public IP, NIC, Serial Console, Run Command, VM agent

## Guardrails

- Default to read-only diagnostics; quote evidence before concluding root cause.
- Do not run extension-backed commands (`az vm user update`, `az vm user reset-ssh`, `az vm user reset-remote-desktop`,
  `az vm run-command invoke`) until [Pre-Flight Safety
  Checks](references/cannot-connect-to-vm.md#pre-flight-safety-checks) pass.
- Do not restart, redeploy, deallocate, or delete unless the user explicitly approves remediation.
- If multiple issues appear, fix network-layer blockers before agent-dependent fixes.

## Evidence Order

1. VM state: power, provisioning, VM agent, extension states.
2. Network layer: public IP, NIC/subnet NSGs, effective routes, IP flow.
3. Guest OS: services and firewall via Run Command only when agent checks are safe.

## Workflow

1. Classify intent. If unclear, ask whether the user uses RDP or SSH and what error appears.
2. Open [references/cannot-connect-to-vm.md](references/cannot-connect-to-vm.md), choose the matching symptom category,
   then open that reference.
3. If a command uses the VM agent/extensions, run pre-flight checks first and stop on any unsafe result.
4. Use `apex-azure/documentation` with `microsoft_docs_search` for the symptom, or `microsoft_docs_fetch` with `url`
   for a selected documentation URL. Other namespace commands must match the discovered inventory.
5. Respond with evidence, likely cause, safe diagnostic/fix commands, and escalation path.

```yaml
apex-azure/documentation
  intent: "find current Azure VM RDP SSH troubleshooting docs for <symptom>"
  command: "microsoft_docs_search"
  parameters:
    query: "<documentation URL or user's symptom>"
```

## Error Handling

| Error | Action |
| --- | --- |
| Docs lookup empty | Use the reference quick commands and tell user the doc URL may have changed |
| VM name/resource group wrong | Ask user to verify resource identity |
| Run Command timeout or `VMAgentStatusCommunicationError` | Do not run extension commands; use Serial Console/offline repair |
| Serial Console unavailable | Enable Boot Diagnostics first |
| Password reset fails | Check VMAccess alternatives in the credential and VM agent references |
| Extension stuck updating | Do not add extensions; use Portal/Serial Console/offline repair |

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/references/compute/vm-troubleshooting.md).
Load only the reference needed for the active task.
