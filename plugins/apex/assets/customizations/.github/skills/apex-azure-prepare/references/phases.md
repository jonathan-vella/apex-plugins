<!-- ref:phases-v1 -->

# Preparation Phases Mapped to Kernel Tasks

Adapted from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
Read [the authority boundary](kernel-boundary.md). These are content dependencies, not a skill-owned state machine.

| Upstream preparation activity | vNext owner/input | Technical reference |
| --- | --- | --- |
| Detect specialized technology | Current task and accepted workload | [Routing](specialized-routing.md) |
| Analyze new/modify/modernize scope | Accepted requirements and authorized workspace inspection | [Analysis](analyze.md) |
| Gather scale, budget, security and recovery needs | Requirements task | [Questions](requirements.md) |
| Inventory components and dependencies | Authorized inspection receipt | [Scan](scan.md) |
| Select recipe/configuration | Accepted selected-track binding; do not choose a second track | [Recipe comparison](recipe-selection.md) |
| Map components to services | Accepted Architecture decisions and workload manifest | [Architecture](architecture.md) |
| Bind intent and ownership | Planning task; typed outputs | [Binding fields](plan-template.md) |
| Research provider/service constraints | Current accepted evidence and locks | [Research](research.md) |
| Confirm tenant, subscription and region | Current task context; reuse unchanged accepted confirmation | [Context](azure-context.md) |
| Generate authorized source/configuration | CodeGen capability, only allowed outputs | [Generation](generate.md) |
| Harden and validate | Accepted policy/security, validation capability receipts | [Security](security.md) |

There is no Phase 1/Phase 2 plan file to approve or update. APEX asks the human about missing choices in chat;
kernel gates record the decision against the exact accepted artifacts. Stop at a pending gate, missing evidence or
unavailable capability. Return results to the kernel-selected task, not a numbered upstream agent.
