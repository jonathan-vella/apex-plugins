# Deployment Operational Checklist

## Preconditions

- Confirm the active operation, validated evidence, target, artifact revision,
  and unexpired approved preview all match before explaining a deployment.
- Explain destructive actions, dependencies, ignored items, and uncertainty as
  returned by the preview. A preview does not authorize a different target.
- Treat absent or mismatched validation proof as a blocker and return to the
  trusted validation lifecycle.

## Recovery And Circuit Breaking

- For policy, governance, budget, build, validation, authentication, timeout,
  or provider failures, preserve the reported evidence and stop at the trusted
  recovery boundary rather than retrying or reconciling independently.
- Use the kernel-provided circuit-breaker and retry decision. Escalate repeated
  failure or an indeterminate provider outcome instead of assuming rollback.
- Route governance drift to renewed accepted evidence and a new authorized
  preview; drift is not a reason to amend the current operation in place.

## Verification

Explain only returned verification observations and their coverage. Endpoint
reachability alone does not establish policy, security, data, or operational
acceptance. Direct provider mutation remains a trusted CLI ceremony.
