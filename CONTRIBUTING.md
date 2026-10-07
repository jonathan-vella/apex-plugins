# Contributing

This repository only hosts released plugin trees. Change APEX itself in
[apex-vnext](https://github.com/jonathan-vella/apex-vnext); do not edit files under `plugins/` by hand.

## Release flow

1. In apex-vnext, merge the release to `main` and publish `@apexops/cli` at the release version to npm. The plugin
   version is the CLI version, and `plugin/CHANGELOG.md` needs a `## [<version>]` section.
2. From a clean apex-vnext checkout of that commit, with this repository cloned beside it as `../apex-plugins`, run the
   dry run and review the plan:

   ```bash
   npm run publish:plugin
   ```

3. Run `npm run publish:plugin -- --apply`. It refuses unless every check in the plan passes. It then builds the
   plugin, creates `release/apex-<version>` from `main` here, replaces `plugins/apex/`, updates `marketplace.json` and
   `provenance.json`, pushes only that branch and opens a pull request. It never merges, pushes to `main` or creates
   tags.
4. Review the pull request. The `validate` check recomputes the tree hash of every hosted plugin, compares it with
   `provenance.json`, and confirms the recorded source commit is on apex-vnext `main`.
5. Merge after review. Clients pick up the release on `copilot plugin update apex` or the next marketplace refresh.

The pin is the apex-vnext source commit SHA recorded in `provenance.json`. A tag such as `apex-v<version>` may label a
release commit here, but nothing installs or verifies by tag.

## Changes to this repository

Changes to the marketplace tooling, workflow or documentation use a branch, a conventional commit and a pull request
into `main`. Run `node --test tools/validate-marketplace.test.mjs` and `node tools/validate-marketplace.mjs` before you
push. Pin GitHub Actions to full commit SHAs.
