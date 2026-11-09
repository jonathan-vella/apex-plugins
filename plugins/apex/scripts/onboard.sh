#!/usr/bin/env sh
set -eu
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
PLUGIN_ROOT="$(dirname -- "$SCRIPT_DIR")"
CLI_PATH="$PLUGIN_ROOT/cli/apex.mjs"
if [ ! -f "$CLI_PATH" ]; then
  echo "Bundled CLI not found at $CLI_PATH" >&2
  exit 1
fi
exec node "$CLI_PATH" bootstrap "$@"
