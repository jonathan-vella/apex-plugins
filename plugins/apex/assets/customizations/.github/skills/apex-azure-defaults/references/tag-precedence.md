# Tag And Governance Precedence

Accepted governance constraints are the current authority for required tag keys, casing, values, inheritance, and
exceptions. Baseline tags are only a fallback when the task context explicitly establishes that no policy contract
exists.

## Decision Order

1. Confirm governance discovery is complete for inherited and target scopes.
2. Apply required keys, casing, values, exclusions, inheritance, and enforcement behavior from accepted constraints.
3. Resolve values only from projected workload, environment, ownership, finance, and operations inputs.
4. If accepted evidence explicitly reports no applicable tag policy, apply the authorized fallback from
   `baseline-fallbacks.md` and record that source.
5. Return a blocker when a required owner, cost center, contact, or restricted value is unresolved.

## Casing And Inheritance

- Use one casing for each logical key. Do not emit case variants such as `owner` and `Owner` together.
- Distinguish tags required on the resource group from tags required on child resources.
- Model `Modify` inheritance as expected behavior, but do not rely on it when a `Deny` requires the tag at creation.
- Preserve exemptions with scope and expiry. An exemption does not remove the requirement outside its scope.

## Existing Workloads

Preserve deployed casing and keys when drift evidence shows they are intentional and an accepted compatibility decision
requires them. Do not propagate a legacy convention to new resources merely because an older workload used it.

## Output Constraint

Place tag intent, value source, propagation behavior, exception, and governance evidence identifier in the architecture
or binding decision. Do not query policy, create policy assignments, or write tags directly from this skill.
