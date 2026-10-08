---
description: "Consumer GitHub Actions safety and reproducibility rules"
applyTo: ".github/workflows/*.yml, .github/workflows/*.yaml"
---

# APEX Automation Rules

- Use least-privilege workflow permissions and immutable major action versions.
- Use `npm ci` for Node.js dependencies and declare the required Node version.
- Keep deployment, approval, and secret-bearing operations outside unmanaged workflows.
- Do not expose credentials in workflow logs or command arguments.
- Use explicit, bounded triggers and concurrency for mutating workflows.
