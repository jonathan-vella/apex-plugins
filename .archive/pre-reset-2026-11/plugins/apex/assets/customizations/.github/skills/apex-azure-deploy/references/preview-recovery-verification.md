# Preview, Recovery, and Verification

## Explain the Approved Preview

An approved preview is an operation-specific description of planned provider changes. Explain only the preview returned
for the active operation and include its target, expiry, semantic changes, destructive actions, dependencies,
unevaluated items, and uncertainty. The preview is not a command, a general deployment plan, or authorization outside
its stated lifecycle conditions.

Do not fill in omitted operations from repository files, provider conventions, or expected resource topology. Omitted or
unevaluated items are evidence limits and must remain visible to the operator.

## Lifecycle and Recovery

| State | Meaning | Permitted Guidance |
| --- | --- | --- |
| Awaiting decision | Preview exists but no authorization is recorded | Explain the preview and kernel-provided next action |
| Authorized | Kernel has accepted the required decision | Direct to the trusted CLI ceremony only |
| Executing | A trusted ceremony has started the provider operation | Report kernel status; do not duplicate it |
| Succeeded | Kernel recorded a completed operation | Explain required verification evidence |
| Failed | Kernel recorded a terminal failure | Explain the reported failure and recovery route |
| Indeterminate | Provider outcome cannot be established | Direct reconciliation; never retry independently |

Recovery is an authorized lifecycle transition, not a guessed rollback. Preserve the provider and kernel evidence,
including partial state. The trusted lifecycle determines whether reconciliation, a new preview, a controlled retry, or
another recovery action is appropriate.

## Delivery Safeguards

Explain only safeguards present in the accepted preview and evidence:

- A deployment strategy is a risk-control decision, not permission to select a target, run a command, or change a
  rollout.
- Stop and route to the trusted lifecycle when a circuit-breaker condition, policy precheck failure, validation
  blocker, or drift signal is reported.
- Treat drift as a reconciliation input. Do not overwrite observed state, infer a baseline, or propose a corrective
  action without a new kernel-authorized preview.
- Keep policy effects, region availability, and known provider limitations visible as blockers or uncertainty. They do
  not become resolved because a deployment reached a terminal state.

Direct commands, recipes, SDK examples, CI definitions, and provider-specific recovery steps remain outside this
guidance. The trusted CLI and provider lifecycle own those executable paths.

## Verification Evidence

Verification confirms the expected post-operation state against the active operation. Explain only observations returned
by the kernel or trusted verification capability, their scope, time, outcome, and limitations. An endpoint being
reachable, for example, does not establish every security, policy, data, or operational acceptance condition.
