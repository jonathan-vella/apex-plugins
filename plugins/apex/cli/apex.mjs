#!/usr/bin/env node
// Plugin CLI entry: delegates to the bundled @apexops/cli runtime in ../mcp/apex.mjs.
import { main } from "../mcp/apex.mjs";

await main();
