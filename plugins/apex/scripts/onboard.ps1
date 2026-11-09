$ErrorActionPreference = "Stop"
$pluginRoot = Split-Path -Parent $PSScriptRoot
$cliPath = Join-Path $pluginRoot "cli\apex.mjs"
if (-not (Test-Path -LiteralPath $cliPath)) {
  throw "Bundled CLI not found at $cliPath"
}
& node $cliPath bootstrap @args
exit $LASTEXITCODE
