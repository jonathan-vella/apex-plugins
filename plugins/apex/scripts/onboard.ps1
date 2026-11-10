$ErrorActionPreference = "Stop"
$pluginRoot = Split-Path -Parent $PSScriptRoot
$cliPath = Join-Path $pluginRoot "cli\apex.mjs"
if (-not (Test-Path -LiteralPath $cliPath)) {
  throw "Bundled CLI not found at $cliPath"
}
$forwarded = @(foreach ($arg in $args) {
  if ($arg -ieq "-Yes") { "--yes" } else { $arg }
})
& node $cliPath bootstrap @forwarded
exit $LASTEXITCODE
