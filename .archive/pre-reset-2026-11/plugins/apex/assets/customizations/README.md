## Managed Workspace Source

This directory is the versioned source for two outputs:

- The thin workspace projection that `apex init` installs and `apex update` updates: `.github/copilot/settings.json`,
  `.github/copilot-instructions.md`, `.github/instructions/`, and the governance workflow and scripts.
- The `apex` plugin built by `tools/scripts/build-plugin.mjs`: agents from `.github/agents/` and skills from
  `.github/skills/`. The plugin owns these paths, so they are never copied into a consumer workspace.

`manifest.json` records the bundle version, managed workspace files, the plugin declaration and the files it owns,
agent roles, supported targets, invocation edges and interaction types. The plugin renders only roles that declare the
`github-copilot` target.

## Editing Policy

Make source changes in this directory and release them as a new bundle version. Consumer copies are managed files; do
not edit them manually. The installer records base and current hashes so update can preserve user changes with a
three-way merge or stop with an actionable conflict instead of silently overwriting them.

The prompts are guidance, not an authorization boundary. The APEX kernel and its narrow MCP tools remain authoritative
for state transitions, validation, approvals, and external operations.
