# Tag And Governance Precedence

Accepted governance constraints are the current authority for required tag keys, casing, values, inheritance, and
exceptions. Baseline tags are only a fallback when the task context explicitly establishes that no policy contract
exists.

## Decision Order

1. Confirm governance discovery is complete for inherited and target scopes.
2. Apply required keys, casing, values, exclusions, inheritance, and enforcement behavior from accepted constraints.
3. Resolve values only from projected workload, environment, ownership, finance, and operations inputs.
4. If accepted evidence explicitly reports no applicable tag policy, apply the greenfield checklist below and record
   that source.
5. Return a blocker when a required owner, cost center, contact, or restricted value is unresolved.

## Greenfield Decision Checklist

Apply this checklist only when complete governance evidence reports no tag policy at the target or any inherited scope.

1. Treat "no tag policy" as a user-owned confirmation when the workload's compliance posture suggests one is expected,
   for example regulated financial or health data. Raise it through the kernel input request; do not assume.
2. Adopt the lowercase nine-key fallback in [baseline fallbacks](baseline-fallbacks.md), with values from projected
   inputs only.
3. Do not add a policy assignment to the design on the user's behalf. Record a recommendation to enact tag policy as a
   decision or plan item for the user to accept.
4. Record the fallback source, evidence identifier, and the recorded user decision in the typed artifact.

## Casing And Inheritance

- Use one casing for each logical key. Do not emit case variants such as `owner` and `Owner` together.
- Policy existence checks on tag keys are case-insensitive, but cost reporting, Resource Graph and SDK tag filters are
  case-sensitive. Mixed casing passes policy and still breaks cost allocation, so keep one casing per scope.
- Distinguish tags required on the resource group from tags required on child resources.
- Model `Modify` inheritance as expected behavior, but do not rely on it when a `Deny` requires the tag at creation.
- Preserve exemptions with scope and expiry. An exemption does not remove the requirement outside its scope.

## Existing Workloads

Preserve deployed casing and keys when drift evidence shows they are intentional and an accepted compatibility decision
requires them. Do not propagate a legacy convention, such as the deprecated PascalCase set, to new resources merely
because an older workload used it. Optional provenance tags such as `ManagedBy` are never required-contract keys.

## Output Constraint

Place tag intent, value source, propagation behavior, exception, and governance evidence identifier in the architecture
or binding decision. Do not query policy, create policy assignments, or write tags directly from this skill.
