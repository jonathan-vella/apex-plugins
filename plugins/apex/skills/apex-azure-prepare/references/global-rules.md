<!-- ref:global-rules-v1 -->

# Preparation Safety Rules

Adapted from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
Read [the authority boundary](kernel-boundary.md); this skill does not establish global workflow authority.

Preserve the upstream destructive-action taxonomy: deletion, overwrites, irreversible purge/database operations,
significant cost changes, exposure of secrets, access-policy changes and RBAC changes all require explicit review.
An ordinary preparation/deployment request is not approval for those effects. Never overwrite user work.

APEX asks for missing choices or destructive intent in chat and records the human's decision through the kernel.
Chat confirmation is not Gate 4: actual cloud/state mutations require the exact preview and local approval binding.
Workers return `needs_input` or a blocker; they do not ask questions or manufacture approval.

Reuse unchanged accepted tenant/subscription/location confirmation. Show the actual target identity when a choice is
missing or conflicting; do not silently use a CLI default, switch accounts or re-ask an already accepted question.
Evidence refresh and permission/policy checks remain separate from target selection.

Security and effective policy are non-waivable. Unknown facts, stale receipts, partial writes and unavailable
capabilities stay explicit. Failed checks never become successful because a reference suggests a workaround.
