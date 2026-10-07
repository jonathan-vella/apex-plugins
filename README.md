# APEX plugins

Agent Plugins marketplace for [APEX vNext](https://github.com/jonathan-vella/apex-vnext), an Azure infrastructure-as-code
agent workflow for GitHub Copilot.

Releases are published from apex-vnext through reviewed pull requests in this repository. Each release pins the APEX
source commit SHA and records the plugin's tree hash as provenance. Tags are release labels only.

## Install

The repository is a Copilot CLI plugin marketplace (`.github/plugin/marketplace.json`). Install through the Copilot CLI
store, which VS Code and the GitHub Copilot app read. Install through one channel only.

```bash
copilot plugin marketplace add jonathan-vella/apex-plugins
copilot plugin install apex@apex-plugins
```

## Layout

```text
.github/plugin/marketplace.json   marketplace listing (Copilot CLI marketplace format)
.github/plugin/provenance.json    per plugin: source commit SHA, bundled CLI version and tree hash
.github/workflows/validate.yml    the validate check
plugins/<name>/                   the exact plugin tree built by apex-vnext (added by the first release)
tools/validate-marketplace.mjs    validator and tree-hash tool (no dependencies)
```

`plugins/<name>/` holds built files, not sources: the APEX build bundles the MCP server and copies agents, skills, hooks
and assets. `.gitattributes` disables end-of-line conversion so every checkout keeps the bytes the build hashed.

## Verify an install

Compare the installed folder with the tree hash in `.github/plugin/provenance.json`:

```bash
node tools/validate-marketplace.mjs --tree ~/.copilot/installed-plugins/apex-plugins/apex
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the release flow.

## Licence

MIT. See [LICENSE](LICENSE).
