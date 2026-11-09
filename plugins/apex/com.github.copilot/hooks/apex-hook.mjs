#!/usr/bin/env node
/**
 * APEX plugin hook. One dependency-free script for every hook event: hooks.json runs it from a bash and a PowerShell
 * command entry with the event name as the only argument, and the client writes the camelCase hook payload to stdin.
 *
 * preToolUse:
 * - Deny the user-facing APEX agent as a `task` target. A person selects APEX in the agent picker; it never runs as a
 *   subagent. Hidden workers and built-in agents are left to the normal permission flow.
 * - Deny the retired `apex-azure-cost` server by name. Restrict `apex-azure` to reviewed namespace commands with
 *   schema-shaped arguments. Namespace grants and upstream readOnlyHint alone are not authorization. Unknown
 *   commands, nonempty-intent learn requests and malformed protected calls are denied before transport.
 *
 * Failure rule: the script always exits 0, because the client denies a preToolUse call when a command hook exits
 * non-zero. Input it cannot parse therefore allows the call (fail open), except that a raw-text scan still denies a
 * `task` call whose target it can read as APEX and every call aimed at either Azure server, and, while a
 * rubber-duck run is marked, an APEX tool or rubber-duck `task` call (fail
 * closed for the deny rules). Allowing means writing nothing: empty output keeps
 * the client's default behaviour, while `permissionDecision: "allow"` could bypass its prompt.
 *
 * Rubber-duck reviews (DECISION-031). Hooks only capture and deny; the kernel decides whether a review counts.
 *
 * - postToolUse saves the prompt and exact output of a `task` call to the built-in `rubber-duck` agent whose prompt
 *   starts with the kernel's `APEX-REVIEW: nonce=<32 hex>` header, as a record signed with the per-user key the APEX
 *   kernel verifies (packages/kernel/src/review-capture.ts holds the same format; a test keeps them aligned). Records
 *   live in the review home (`$APEX_REVIEW_HOME`, else `~/.apex/reviews`), outside every workspace.
 *   When Copilot CLI moves the call to the background, the `task` result is only a start notice: the hook then writes a
 *   signed record under `pending/` (agent ID, session, prompt), and a later `read_agent` result for that agent ID, in
 *   the same session, that holds an apex-review block becomes the capture and removes the pending record.
 * - subagentStart marks a rubber-duck run as active for its parent session and folder; subagentStop and
 *   postToolUseFailure clear one mark; marks expire after MARKER_TTL_MS. A rubber-duck call that preToolUse denied
 *   leaves a denial record, which its postToolUseFailure event consumes instead of clearing the running run's mark;
 *   if the record cannot be written, the marks that failure could clear are duplicated instead.
 * - preToolUse denies APEX state-changing MCP tools to every session in that folder that owns no active mark: a
 *   subagent's tool calls carry the subagent's own sessionId, while subagentStart carries the parent's. Only one
 *   rubber-duck run per folder may be active, so a reviewer cannot make itself a parent.
 *   The read-only APEX tools come from apex-mcp-tools.json, which the plugin build derives from the MCP server.
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import {
  closeSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  linkSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const APEX_AGENT_ID = "apex";
// `task` in camelCase payloads; `Agent` (or `Task`) in PascalCase payloads, which use Claude tool names.
const TASK_TOOLS = new Set(["task", "Task", "Agent"]);

export const APEX_PLUGIN_NAME = "apex";

export const AZURE_COMMAND_POLICY = Object.freeze({"documentation":{"kind":"router","commands":{"microsoft_docs_search":{"inputSchema":{"type":"object","properties":{"query":{"type":"string"}}},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"b1d7589b4a6d00139f51ad373b19ce472452ff5a5f36fffa3af2217656600cc8"},"microsoft_code_sample_search":{"inputSchema":{"type":"object","properties":{"query":{"type":"string"},"language":{"type":"string"}},"required":["query"]},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"7b01397130c2c7cafae609f058610edfe60b8a7fe1aeb890d3abf3ed17a3db7f"},"microsoft_docs_fetch":{"inputSchema":{"type":"object","properties":{"url":{"type":"string"}},"required":["url"]},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"20ade5748d27d072f1e0fa2103530d92e74562e76ef5f4395a6c296275d6252e"}}},"get_azure_bestpractices":{"kind":"router","commands":{"get_azure_bestpractices_ai_app":{"inputSchema":{"type":"object","properties":{},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"99334726611ccf58a148b0814696bfa6fe08c1b2d027e946beccf5a74331c9aa"},"get_azure_bestpractices_get":{"inputSchema":{"type":"object","properties":{"resource":{"type":"string"},"action":{"type":"string"}},"required":["resource","action"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"1b0aeb1c6a89ea9815d43bab39cea97a77a7efd0b29bb8cce0e3091e924b8c76"}}},"aks":{"kind":"router","commands":{"aks_cluster_get":{"inputSchema":{"type":"object","properties":{"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"},"cluster":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"cb3348dbb5b69b3da41c9845893b41bb5fb1d15c6fb2d654fc19daa4d13d951c"},"aks_nodepool_get":{"inputSchema":{"type":"object","properties":{"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"},"cluster":{"type":"string"},"nodepool":{"type":"string"}},"required":["resource-group","cluster"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"e1c6351750bfc2ada832b30b3a7e407de0924f32ccf1984f757a4763ccf8e6ef"}}},"applens":{"kind":"router","commands":{"applens_resource_diagnose":{"inputSchema":{"type":"object","properties":{"tenant":{"type":"string"},"resource-group":{"type":"string"},"question":{"type":"string"},"resource":{"type":"string"},"resource-type":{"type":"string"},"subscription":{"type":"string"}},"required":["question","resource"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"3060a045e96b9ebc45e277ebf4aaded64eb8b59af5a3f04cd0b290428608771e"}}},"appservice":{"kind":"router","commands":{"appservice_webapp_deployment_get":{"inputSchema":{"type":"object","properties":{"app":{"type":"string"},"deployment-id":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["app","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"b24a12aa2b20f78ba4ee90f4b5eeef125dc47b86f852e91e95a80c92c8d1a1c1"},"appservice_webapp_diagnostic_diagnose":{"inputSchema":{"type":"object","properties":{"app":{"type":"string"},"detector-id":{"type":"string"},"start-time":{"type":["string","null"],"format":"date-time"},"end-time":{"type":["string","null"],"format":"date-time"},"interval":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["app","detector-id","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"f564c594209e8c548ec0327764db69eb9d6464fed9264e61edf9d78ac14d03d3"},"appservice_webapp_diagnostic_list":{"inputSchema":{"type":"object","properties":{"app":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["app","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"dcac2540302d33922df8d4687fc41d7cd3c3bdb24510f222b1e48c82a60aadef"},"appservice_webapp_get":{"inputSchema":{"type":"object","properties":{"app":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"e761920dc68d8868aeb53842604926935b8eae84ef01090034f01145c1379ea8"}}},"role":{"kind":"router","commands":{"role_assignment_list":{"inputSchema":{"type":"object","properties":{"scope":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"}},"required":["scope"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"74aea065d2768598808607e8ce72e762907b6e7948823452074c72c563bde2ef"}}},"azurebackup":{"kind":"router","commands":{"azurebackup_backup_status":{"inputSchema":{"type":"object","properties":{"datasource-id":{"type":"string"},"location":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"}},"required":["datasource-id","location"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"df1f5f5480f8557b5e47fe31b38127b32cc633b9078b451acb58030efd1c1fcf"},"azurebackup_container_get":{"inputSchema":{"type":"object","properties":{"vault":{"type":"string"},"container":{"type":"string"},"storage-account":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["vault","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"123c06dcc426858e3102d32ef49da70dec4de441c55e8c2ebc4259016b877f02"},"azurebackup_container_list-available":{"inputSchema":{"type":"object","properties":{"vault":{"type":"string"},"filter":{"type":"string"},"storage-account":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["vault","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"961509ca3dfbafda28c87cade0efbf195b1cf7b0b3f79528f6f1e1a23406efbd"},"azurebackup_governance_find-unprotected":{"inputSchema":{"type":"object","properties":{"resource-type-filter":{"type":"string"},"tag-filter":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"ebd8d6a6508b770448e62dff06428d4e774457d574a12b6932ade5f912b1baa7"},"azurebackup_job_get":{"inputSchema":{"type":"object","properties":{"job":{"type":"string"},"vault":{"type":"string"},"vault-type":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["vault","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"16c8ef4f7f39555f81c70f6cd20970db415fcc99be72820b53de6f8fd19f902d"},"azurebackup_policy_get":{"inputSchema":{"type":"object","properties":{"policy":{"type":"string"},"vault":{"type":"string"},"vault-type":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["vault","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"92ac57b536544b02ac59dbfafcd959160161c5730cf7e7627397fd55c1162eef"},"azurebackup_protectableitem_list":{"inputSchema":{"type":"object","properties":{"workload-type":{"type":"string"},"vault":{"type":"string"},"vault-type":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["vault","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"077bd59ac08af89bf5d45d951f62a75d88736b5e2f76369e2d7673ccf0a20254"},"azurebackup_protecteditem_get":{"inputSchema":{"type":"object","properties":{"protected-item":{"type":"string"},"container":{"type":"string"},"vault":{"type":"string"},"vault-type":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["vault","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"d96f4eaed7ca25e2aa692c24111fb7b78c67d351b85c64792020b535eee32f07"},"azurebackup_recoverypoint_get":{"inputSchema":{"type":"object","properties":{"protected-item":{"type":"string"},"container":{"type":"string"},"recovery-point":{"type":"string"},"vault":{"type":"string"},"vault-type":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["protected-item","vault","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"8fe80196c74cade1d2619c2e173a3d2634254ea0f98403a36dd6de77cd8d6f1b"},"azurebackup_resourceguard_get":{"inputSchema":{"type":"object","properties":{"resource-guard":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"cbd0039daed9cfdec1a48e2035f552f04f27c9e27c0ee552bd126f0c52b7d008"},"azurebackup_vault_get":{"inputSchema":{"type":"object","properties":{"vault":{"type":"string"},"vault-type":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"},"expand":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"87120e20622b67cad761b94528db9154db3538db8f7a19efed2e24cd74eff8b4"},"azurebackup_vault_privateendpoint_get":{"inputSchema":{"type":"object","properties":{"private-endpoint-name":{"type":"string"},"vault":{"type":"string"},"vault-type":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["vault","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"e15d284327e98a1071d7cb424bfe4c55b32ef20776e1d21585a7f18ca246c8ad"}}},"azureterraform":{"kind":"router","commands":{"azureterraform_avm_get":{"inputSchema":{"type":"object","properties":{"module-name":{"type":"string"},"module-version":{"type":"string"}},"required":["module-name","module-version"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"ac59e421cdca69eeb2cfc415d6d8ee468bc2a33821ceb322e6fcbdd54c1e20bb"},"azureterraform_avm_list":{"inputSchema":{"type":"object","properties":{},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"99334726611ccf58a148b0814696bfa6fe08c1b2d027e946beccf5a74331c9aa"},"azureterraform_avm_versions":{"inputSchema":{"type":"object","properties":{"module-name":{"type":"string"}},"required":["module-name"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"ca4a2c55fcbdbfadfe6b9e075e9aae45ab05808991ef424b85e354344fa0b498"},"azureterraform_azapi_get":{"inputSchema":{"type":"object","properties":{"resource-type":{"type":"string"},"api-version":{"type":"string"}},"required":["resource-type"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"12d982385400857d9ae8cbbdf0fad36afb94b15830e437413c330ffd168df0fc"},"azureterraform_azurerm_get":{"inputSchema":{"type":"object","properties":{"resource-type":{"type":"string"},"doc-type":{"type":"string"},"argument":{"type":"string"},"attribute":{"type":"string"}},"required":["resource-type"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"0f1f01fc391d40205bb3832b6baecc255220169e61589e68f4a18b30fcfe27bf"}}},"azureterraformbestpractices":{"kind":"router","commands":{"azureterraformbestpractices_get":{"inputSchema":{"type":"object","properties":{},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"99334726611ccf58a148b0814696bfa6fe08c1b2d027e946beccf5a74331c9aa"}}},"acr":{"kind":"router","commands":{"acr_registry_list":{"inputSchema":{"type":"object","properties":{"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2be475a9f482b43f39a5d26ca7502301d0da20b6bcbbbc98329607b4565aee4d"},"acr_registry_repository_list":{"inputSchema":{"type":"object","properties":{"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"},"registry":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"e6cd656fac30fca61144cb0632605ce46945085ed5d01168e5928ec24c5c2550"}}},"advisor":{"kind":"router","commands":{"advisor_metadata_get":{"inputSchema":{"type":"object","properties":{"recommendation-type-id":{"type":"string"},"language":{"type":"string"}},"required":["recommendation-type-id"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"9e15b49a6cd96e05214a22c9b5b1b9257c08c3268762c6ed0b640db9c2282dab"},"advisor_metadata_list":{"inputSchema":{"type":"object","properties":{"language":{"type":"string"},"resource-type":{"type":"string"},"impact":{"type":"string"},"category":{"type":"string"},"sub-category":{"type":"string"},"tracking-id":{"type":"string"},"retirement-date":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"394fedb55874f19a8b2bbb2c6d0f8546a4a1d7c8c285cfbf3875cc0ea9912aa8"},"advisor_recommendation_list":{"inputSchema":{"type":"object","properties":{"category":{"type":"string"},"impact":{"type":"string"},"status":{"type":"string"},"recommendation-type-id":{"type":"string"},"resource-type":{"type":"string"},"resource":{"type":"string"},"search":{"type":"string"},"sub-category":{"type":"string"},"tracking-ids":{"type":"array","items":{"type":"string"}},"retirement-date":{"type":"string"},"top":{"type":["integer","null"]},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"644b27ee88d75cac1870ed9b48d836c9fbaf117fd1057a46f0fdc6e1eef24277"},"advisor_recommendation_summary":{"inputSchema":{"type":"object","properties":{"group-by":{"type":"string"},"category":{"type":"string"},"impact":{"type":"string"},"recommendation-type-id":{"type":"string"},"resource-type":{"type":"string"},"resource":{"type":"string"},"search":{"type":"string"},"sub-category":{"type":"string"},"retirement-date":{"type":"string"},"top":{"type":["integer","null"]},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"9390534938e0ccc0e1c755fcf21ca913e79e1b27a5d0966dcefbe4e063273b68"},"advisor_remediation_get":{"inputSchema":{"type":"object","properties":{"recommendation-type-id":{"type":"string"}},"required":["recommendation-type-id"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"4e42f641bbe3576488919a2ca68fabbe7d522c9e81699ffd04f74f7ef9cb1660"}}},"bicepschema":{"kind":"router","commands":{"bicepschema_get":{"inputSchema":{"type":"object","properties":{"resource-type":{"type":"string"}},"required":["resource-type"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2d49e63c188adc949afc564ab9f015360b1d267394aa579a0a8977b81aeb9cf9"}}},"cloudarchitect":{"kind":"router","commands":{"cloudarchitect_design":{"inputSchema":{"type":"object","properties":{"question":{"type":"string"},"question-number":{"type":"integer"},"total-questions":{"type":"integer"},"answer":{"type":"string"},"next-question-needed":{"type":"boolean"},"confidence-score":{"type":["number","null"]},"state":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"819f9f776c683b7ca37a55797af26cae665469166f17654057448a0775628770"}}},"compute":{"kind":"router","commands":{"compute_disk_get":{"inputSchema":{"type":"object","properties":{"disk-name":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"38a75470261129653a76db20313aa8c2e35440fc91fd3e06c8375ba569ef6ce8"},"compute_vm_get":{"inputSchema":{"type":"object","properties":{"vm-name":{"type":"string"},"instance-view":{"type":"boolean"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"aabf045694433a263aecd52a3aac25a789257e9898d65599861197960b0bf95c"},"compute_vmss_get":{"inputSchema":{"type":"object","properties":{"vmss-name":{"type":"string"},"instance-id":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2dd4391214e648791778e776774196005c9b7013d3e95d983b03d3a1a1148ec4"}}},"containerapps":{"kind":"router","commands":{"containerapps_list":{"inputSchema":{"type":"object","properties":{"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2be475a9f482b43f39a5d26ca7502301d0da20b6bcbbbc98329607b4565aee4d"}}},"cosmos":{"kind":"router","commands":{"cosmos_list":{"inputSchema":{"type":"object","properties":{"database":{"type":"string"},"account":{"type":"string"},"resource-group":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"auth-method":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"b9840088cd125851771af1f24b4924acfaf01a6e900da27ea09fe1142ab92491"}}},"deploy":{"kind":"router","commands":{"deploy_app_logs_get":{"inputSchema":{"type":"object","properties":{"workspace-folder":{"type":"string"},"azd-env-name":{"type":"string"},"limit":{"type":["integer","null"]},"subscription":{"type":"string"}},"required":["workspace-folder","azd-env-name"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"f2d6e576013fb133d07a9aadda2ad56d91dec5aa28df0bed87a54a0cb3aa3b69"},"deploy_iac_rules_get":{"inputSchema":{"type":"object","properties":{"deployment-tool":{"type":"string"},"iac-type":{"type":"string"},"resource-types":{"type":"string"}},"required":["deployment-tool"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"accfcd36ebb6e1792f33478af9cf9b6857bd0e11bbc23cb1da29c15a4e2f6120"},"deploy_pipeline_guidance_get":{"inputSchema":{"type":"object","properties":{"is-azd-project":{"type":"boolean"},"pipeline-platform":{"type":"string"},"deploy-option":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"1db4aee50b8c23e814eeb9e3ff7eaa3a6169d75e0cb74f27c9f7edf764b8b890"},"deploy_plan_get":{"inputSchema":{"type":"object","properties":{"project-name":{"type":"string"},"target-app-service":{"type":"string"},"provisioning-tool":{"type":"string"},"source-type":{"type":"string"},"deploy-option":{"type":"string"},"iac-options":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"}},"required":["project-name"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"e774522ec750cc78766264c47690063d45071de5d5c50570a0d6672276d0867e"}}},"eventgrid":{"kind":"router","commands":{"eventgrid_subscription_list":{"inputSchema":{"type":"object","properties":{"topic":{"type":"string"},"location":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"6b84a20ac284cd9150d00a0fe779bb06c60e776f00bd4dd501054e7e304596cc"},"eventgrid_topic_list":{"inputSchema":{"type":"object","properties":{"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2be475a9f482b43f39a5d26ca7502301d0da20b6bcbbbc98329607b4565aee4d"}}},"eventhubs":{"kind":"router","commands":{"eventhubs_eventhub_consumergroup_get":{"inputSchema":{"type":"object","properties":{"namespace":{"type":"string"},"eventhub":{"type":"string"},"consumer-group":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["namespace","eventhub","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"ff61b6b58c7fae9b9262695d0bae9332e087030fc370279cccd549b5a5e21be8"},"eventhubs_eventhub_get":{"inputSchema":{"type":"object","properties":{"namespace":{"type":"string"},"eventhub":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["namespace","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"6b908db1c176383fc6b66e0e83bd5fb76640fd666fa148163e41b2ab3d0a6190"},"eventhubs_namespace_get":{"inputSchema":{"type":"object","properties":{"namespace":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"359b9b517aedfba74a5dbb793665d6b9071c3ac4581d8b06d4e9c59937137ff6"}}},"fileshares":{"kind":"router","commands":{"fileshares_fileshare_check-name-availability":{"inputSchema":{"type":"object","properties":{"name":{"type":"string"},"location":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["name","location"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"daa8916737b00cfe6cfbb1e344aefab07898eb7d9f408e8ae0a13541546afaeb"},"fileshares_fileshare_get":{"inputSchema":{"type":"object","properties":{"name":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"ab857142d2a0a857a7427766fcc167bc75f02ea83a26ef357d99062699894846"},"fileshares_fileshare_peconnection_get":{"inputSchema":{"type":"object","properties":{"file-share-name":{"type":"string"},"connection-name":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["file-share-name","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"9fc43f1c3cebd1d1bb2602c507cbe7b531055751fa54c910ac3f7143f1b4932c"},"fileshares_fileshare_snapshot_get":{"inputSchema":{"type":"object","properties":{"file-share-name":{"type":"string"},"snapshot-name":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["file-share-name","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2f7e6a244d02caa22fc15e9347ea1a93a67ebcfca45b59a8533e828083196755"},"fileshares_limits":{"inputSchema":{"type":"object","properties":{"location":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["location"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"ea20f42a0d27edb3d83e4dac87032fa1f63f7c1bfab483a3f6072610fae6448f"},"fileshares_rec":{"inputSchema":{"type":"object","properties":{"location":{"type":"string"},"provisioned-storage-in-gib":{"type":"integer"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["location","provisioned-storage-in-gib"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"6831456279cb41aebe36d48842ac47c6bc89c50b23ae35e2b16b1483b1cf0133"},"fileshares_usage":{"inputSchema":{"type":"object","properties":{"location":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["location"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"ea20f42a0d27edb3d83e4dac87032fa1f63f7c1bfab483a3f6072610fae6448f"}}},"functionapp":{"kind":"router","commands":{"functionapp_get":{"inputSchema":{"type":"object","properties":{"function-app":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"07d10487b4a8ab2b6b58a090ac097aae6c1f654b38c5064442f61a1236c11d2c"}}},"functions":{"kind":"router","commands":{"functions_language_list":{"inputSchema":{"type":"object","properties":{},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"99334726611ccf58a148b0814696bfa6fe08c1b2d027e946beccf5a74331c9aa"},"functions_project_get":{"inputSchema":{"type":"object","properties":{"language":{"type":"string"}},"required":["language"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"d163399e76c0081539833b7326f79fe6c51ba34b937358e1f34638ce72d0c004"},"functions_template_get":{"inputSchema":{"type":"object","properties":{"language":{"type":"string"},"template":{"type":"string"},"runtime-version":{"type":"string"},"output":{"type":"string"}},"required":["language"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"4a56c6b13b595714a4a11b2740f962324d54931654092c28134ea34b64e352a4"}}},"quota":{"kind":"router","commands":{"quota_region_availability_list":{"inputSchema":{"type":"object","properties":{"resource-types":{"type":"string"},"cognitive-service-model-name":{"type":"string"},"cognitive-service-model-version":{"type":"string"},"cognitive-service-deployment-sku-name":{"type":"string"},"subscription":{"type":"string"}},"required":["resource-types"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"d5f85051f2a7138e7d64ae8c455c2eb4d228ecf4840ee7925b428467225bc132"},"quota_usage_check":{"inputSchema":{"type":"object","properties":{"region":{"type":"string"},"resource-types":{"type":"string"},"subscription":{"type":"string"}},"required":["region","resource-types"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"f090b29fc78f4a9726ee50887bd13b7582b88b45b69769af18396173e9b31a02"}}},"monitor":{"kind":"router","commands":{"monitor_activitylog_list":{"inputSchema":{"type":"object","properties":{"resource-name":{"type":"string"},"resource-type":{"type":"string"},"hours":{"type":["number","null"]},"event-level":{"type":"string"},"top":{"type":["integer","null"]},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["resource-name"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"449f0ac1e5557759357403324fb7ab3e80925b7488cb7df326b333953a6bacaa"},"monitor_healthmodels_get":{"inputSchema":{"type":"object","properties":{"health-model":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["health-model","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"88cfb734362352e6f905291ac40af6c5eb7ef1ad1d74956a885c615b63566c3d"},"monitor_healthmodels_list":{"inputSchema":{"type":"object","properties":{"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2be475a9f482b43f39a5d26ca7502301d0da20b6bcbbbc98329607b4565aee4d"},"monitor_instrumentation_get-learning-resource":{"inputSchema":{"type":"object","properties":{"path":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"5dd1c064680a080be3dcdc96688a5bbaa091abcbdbca1b82d8d1f5f9f1759017"},"monitor_metrics_batchquery":{"inputSchema":{"type":"object","properties":{"resources":{"type":"string"},"resource-type":{"type":"string"},"resource-group":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"metric-names":{"type":"string"},"metric-namespace":{"type":"string"},"start-time":{"type":"string"},"end-time":{"type":"string"},"interval":{"type":"string"},"aggregation":{"type":"string"},"filter":{"type":"string"},"order-by":{"type":"string"},"top":{"type":["integer","null"]},"max-buckets":{"type":["integer","null"]}},"required":["resources","metric-names","metric-namespace"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"646319c01309cede56ff65d7213861ea013945b9b785003c89570cf526469740"},"monitor_metrics_definitions":{"inputSchema":{"type":"object","properties":{"search-string":{"type":"string"},"limit":{"type":"integer"},"metric-namespace":{"type":"string"},"resource-type":{"type":"string"},"resource":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["resource"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"b17314d142a8984ba01f8e92e29d026c1a97e5003317e1ebd835988b043d54fd"},"monitor_metrics_query":{"inputSchema":{"type":"object","properties":{"metric-names":{"type":"string"},"start-time":{"type":"string"},"end-time":{"type":"string"},"interval":{"type":"string"},"aggregation":{"type":"string"},"filter":{"type":"string"},"max-buckets":{"type":["integer","null"]},"metric-namespace":{"type":"string"},"resource-type":{"type":"string"},"resource":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["metric-names","metric-namespace","resource"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2e00bbb37641a37636e25a7c9248fcb9b46a519f83f69a60ce9d9b597d50502c"},"monitor_resource_log_query":{"inputSchema":{"type":"object","properties":{"query":{"type":"string"},"hours":{"type":["integer","null"]},"limit":{"type":["integer","null"]},"table":{"type":"string"},"resource-id":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"}},"required":["query","table","resource-id"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"601edcef1a5354db5d49e159abca46065dcfb0345f8c4a4b92b5ec90caf623b1"},"monitor_table_list":{"inputSchema":{"type":"object","properties":{"workspace":{"type":"string"},"table-type":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["workspace","table-type","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"e8e0173a25ac2bdd890c7d0502c593fbee7fb6d2cf45669495051916ed937999"},"monitor_table_type_list":{"inputSchema":{"type":"object","properties":{"workspace":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"required":["workspace","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"f1e27e2fffb67137f9282e08aa7e060c5c145592935db340daeb8e0110354b53"},"monitor_webtests_get":{"inputSchema":{"type":"object","properties":{"webtest-resource":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2336da4bf65b240acb8b95dc1c3d4e8cb5d3efab56059b92973bc49fa0859de8"},"monitor_workspace_list":{"inputSchema":{"type":"object","properties":{"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2be475a9f482b43f39a5d26ca7502301d0da20b6bcbbbc98329607b4565aee4d"},"monitor_workspace_log_query":{"inputSchema":{"type":"object","properties":{"workspace":{"type":"string"},"query":{"type":"string"},"hours":{"type":["integer","null"]},"limit":{"type":["integer","null"]},"table":{"type":"string"},"tenant":{"type":"string"},"subscription":{"type":"string"}},"required":["workspace","query","table"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"f126f0e4d1ed700d7fa14d7623430fe273b5374016c2c74bf254a12e57d30a61"},"monitor_workspace_log_search":{"inputSchema":{"type":"object","properties":{"resource-group":{"type":"string"},"workspace":{"type":"string"},"table":{"type":"string"},"query":{"type":"string"},"timespan":{"type":"string"},"limit":{"type":"integer"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["resource-group","workspace","table","query","timespan"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"5f010882de4735363dbbf726ad5ff001e2295be6e097a018f56fd638e2aa188d"}}},"applicationinsights":{"kind":"router","commands":{"applicationinsights_recommendation_list":{"inputSchema":{"type":"object","properties":{"tenant":{"type":"string"},"subscription":{"type":"string"},"resource-group":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2be475a9f482b43f39a5d26ca7502301d0da20b6bcbbbc98329607b4565aee4d"}}},"mysql":{"kind":"router","commands":{"mysql_list":{"inputSchema":{"type":"object","properties":{"user":{"type":"string"},"server":{"type":"string"},"database":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"dc716c3ce969ec8c47e778f72e36c013d2fa69455fb83fd518db58a2e7e6aac6"},"mysql_server_config_get":{"inputSchema":{"type":"object","properties":{"server":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"}},"required":["server","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"fc5b4f7dc7810d43fe4d6c880594adc6cf13066c83d037dd6b81c153c43cecae"},"mysql_server_param_get":{"inputSchema":{"type":"object","properties":{"param":{"type":"string"},"server":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"}},"required":["param","server","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"98b12d86be885d53ea06bb242dc80ee4d3f349c1c9ece0346e860ba5bdd266d8"},"mysql_table_schema_get":{"inputSchema":{"type":"object","properties":{"table":{"type":"string"},"server":{"type":"string"},"database":{"type":"string"},"user":{"type":"string"}},"required":["table","server","database","user"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"b24a7295c47f569edc589d068659a028591bd4b7765c29efe59f7694e908ea31"}}},"optimization":{"kind":"router","commands":{"optimization_recommendation_alternatives":{"inputSchema":{"type":"object","properties":{"resource-id":{"type":"string"},"new-skus":{"type":"string"},"new-vm-series":{"type":"string"},"new-processor-types":{"type":"string"},"exclude-skus":{"type":"string"},"exclude-vm-series":{"type":"string"},"exclude-processor-types":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"5d62da44ec65abd7911f0322c87ad9a5369b5c629e0fb6d0953d65d0ae993161"},"optimization_recommendation_explain":{"inputSchema":{"type":"object","properties":{"resource-id":{"type":"string"},"target-sku":{"type":"string"},"view":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"6613851f1d00440f19d1eba00d909dea70462422638d83858fc8405039f444d8"},"optimization_recommendation_list":{"inputSchema":{"type":"object","properties":{"top":{"type":["integer","null"]},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"7198c2aa062970d0f4ce0376e6bd0a32e91420c527c3bb2a227a1ac5f91cff90"}}},"policy":{"kind":"router","commands":{"policy_assignment_list":{"inputSchema":{"type":"object","properties":{"scope":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"3b473dfbff5d644322d4df1a6c390100654c9115d5382fd773a935e1b1b3a7da"}}},"postgres":{"kind":"router","commands":{"postgres_list":{"inputSchema":{"type":"object","properties":{"auth-type":{"type":"string"},"user":{"type":"string"},"password":{"type":"string"},"server":{"type":"string"},"database":{"type":"string"},"schema":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"7946c2d38f5482d3ac4c4d91d549658f1686db7615faa5a69f0f04bc000a4caf"},"postgres_server_config_get":{"inputSchema":{"type":"object","properties":{"server":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["server","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"09a2b6c60071458e8a88f426dc59a5eb278dd523550832bdf855498f8b14a1a2"},"postgres_server_param_get":{"inputSchema":{"type":"object","properties":{"param":{"type":"string"},"server":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["param","server","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"71d82ca14d5fb3b54e84ff9f8081ba8b46999049f9f4294c7d8b6827e9c567df"},"postgres_table_schema_get":{"inputSchema":{"type":"object","properties":{"table":{"type":"string"},"auth-type":{"type":"string"},"user":{"type":"string"},"password":{"type":"string"},"server":{"type":"string"},"database":{"type":"string"}},"required":["table","auth-type","user","server","database"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"756c439ed8e60835e226921d1bd05714926d1c2ecae85499569b4e4802c3f38f"}}},"pricing":{"kind":"router","commands":{"pricing_get":{"inputSchema":{"type":"object","properties":{"currency":{"type":"string"},"sku":{"type":"string"},"service":{"type":"string"},"region":{"type":"string"},"service-family":{"type":"string"},"price-type":{"type":"string"},"include-savings-plan":{"type":"boolean"},"filter":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"07eb423a63468fc3f9ba9f7ee1bb78cd3da4b101415271562e269bcb9a65f33f"}}},"redis":{"kind":"router","commands":{"redis_list":{"inputSchema":{"type":"object","properties":{"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"970c15caf5676ac233109f325d09a72647772c500356919a79a4aac132dd6a67"}}},"resiliency":{"kind":"router","commands":{"resiliency_drill_get":{"inputSchema":{"type":"object","properties":{"service-group":{"type":"string"},"name":{"type":"string"},"tenant":{"type":"string"}},"required":["service-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"40ddee81e88f82f3c692825a2a7504223c2b7fcf782d471659e8300886073beb"},"resiliency_drill_resource_get":{"inputSchema":{"type":"object","properties":{"service-group":{"type":"string"},"drill":{"type":"string"},"name":{"type":"string"},"tenant":{"type":"string"}},"required":["service-group","drill"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"c8857d18e89c227b01dd65081174690c75d4cbbc30292edf8c2c96efc358116e"},"resiliency_drill_run_get":{"inputSchema":{"type":"object","properties":{"service-group":{"type":"string"},"drill":{"type":"string"},"name":{"type":"string"},"tenant":{"type":"string"}},"required":["service-group","drill"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"53cf211998d177a0eccd8d27923edda17331f8b0be0311314891ccb00edf79b8"},"resiliency_drill_run_resource_get":{"inputSchema":{"type":"object","properties":{"service-group":{"type":"string"},"drill":{"type":"string"},"drill-run":{"type":"string"},"name":{"type":"string"},"tenant":{"type":"string"}},"required":["service-group","drill","drill-run"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"d38a10c3e925f610b1ca0163a3849d4a5069756308c9b879c45b132e08f67ad9"},"resiliency_goal_assignment_get":{"inputSchema":{"type":"object","properties":{"service-group":{"type":"string"},"name":{"type":"string"},"tenant":{"type":"string"}},"required":["service-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"a8300d520e18177bb77e2a37b243d1cc8ae94a6475ce35c35298729d8d4a778f"},"resiliency_goal_resource_get":{"inputSchema":{"type":"object","properties":{"service-group":{"type":"string"},"goal-assignment":{"type":"string"},"name":{"type":"string"},"tenant":{"type":"string"}},"required":["service-group","goal-assignment"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"5e94be9ae5486d11f5346c3f54311627532ad5ce79fca49758f1ad056eba018c"},"resiliency_recoveryjob_get":{"inputSchema":{"type":"object","properties":{"service-group":{"type":"string"},"recoveryplan":{"type":"string"},"name":{"type":"string"},"tenant":{"type":"string"}},"required":["service-group","recoveryplan"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"1c7673bb36a5eba815d9f831f8c69abceb4c86ca183fead79e7ab0f2e67e2ecd"},"resiliency_recoveryjob_resource_get":{"inputSchema":{"type":"object","properties":{"service-group":{"type":"string"},"recoveryplan":{"type":"string"},"recoveryjob":{"type":"string"},"name":{"type":"string"},"tenant":{"type":"string"}},"required":["service-group","recoveryplan","recoveryjob"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"a1195d95ba46780a404840335ca37d3404cf12819b015669ec17aa45e0b8fcc6"},"resiliency_recoveryplan_get":{"inputSchema":{"type":"object","properties":{"service-group":{"type":"string"},"name":{"type":"string"},"tenant":{"type":"string"}},"required":["service-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"12c9b7e0151cdcde9cb10fdc4467ca5173deeef8dc121077b556787ad39c983f"},"resiliency_recoveryplan_resource_get":{"inputSchema":{"type":"object","properties":{"service-group":{"type":"string"},"recoveryplan":{"type":"string"},"name":{"type":"string"},"tenant":{"type":"string"}},"required":["service-group","recoveryplan"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"651f34baf8d9de7eeaf903004fdc5cea34b84f4055dab3ffabacd59de5fd03d6"},"resiliency_usageplan_enrollment_get":{"inputSchema":{"type":"object","properties":{"resource-group":{"type":"string"},"usage-plan":{"type":"string"},"name":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["resource-group","usage-plan"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"697ad6442758ced1dbdacdfc6f56456b4dab608417f344bab503783b7cb1efee"},"resiliency_usageplan_get":{"inputSchema":{"type":"object","properties":{"resource-group":{"type":"string"},"name":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2f17f4a485879ec6a09d133167c344e40d90908d151998b6c2ac49c7b752d0e9"}}},"resourcehealth":{"kind":"router","commands":{"resourcehealth_availability-status_get":{"inputSchema":{"type":"object","properties":{"resourceId":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2cad25c3a049d2d1f06942824fad973638b3741a95a60d6b64b1a1efa4f3cb1d"},"resourcehealth_health-events_list":{"inputSchema":{"type":"object","properties":{"event-type":{"type":"string"},"status":{"type":"string"},"tracking-id":{"type":"string"},"filter":{"type":"string"},"query-start-time":{"type":"string"},"query-end-time":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"d9699b6f069f31a50787aac82e3f0e9c8fb600d61f2b5772ad29c8fc7ac55e75"}}},"servicebus":{"kind":"router","commands":{"servicebus_queue_details":{"inputSchema":{"type":"object","properties":{"namespace":{"type":"string"},"queue":{"type":"string"},"tenant":{"type":"string"}},"required":["namespace","queue"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"58b232dbc1830859ba1b18ed090153f01e857bd8feb540f105005ca24067abf9"},"servicebus_topic_details":{"inputSchema":{"type":"object","properties":{"namespace":{"type":"string"},"topic":{"type":"string"},"tenant":{"type":"string"}},"required":["namespace","topic"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"cdab043ab6982644fb4998d1adbd811acdcb7f2b6da0792536dbf004d85c08d5"},"servicebus_topic_subscription_details":{"inputSchema":{"type":"object","properties":{"subscription-name":{"type":"string"},"namespace":{"type":"string"},"topic":{"type":"string"},"tenant":{"type":"string"}},"required":["subscription-name","namespace","topic"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"053a1e5b8907dd9e8eb2512dbbd0fb27d97d301cc4c53418f11cc9f2069b15f6"}}},"sql":{"kind":"router","commands":{"sql_db_get":{"inputSchema":{"type":"object","properties":{"database":{"type":"string"},"server":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"}},"required":["server","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"cb6ed32f0de83080a147032bf6935afc68ae4db70a6adad3a4e72acb284e4c88"},"sql_elastic-pool_list":{"inputSchema":{"type":"object","properties":{"server":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"}},"required":["server","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"606084323a559c13e000b4662535b6942dd591875c5ca53b9fb583b373933560"},"sql_server_entra-admin_list":{"inputSchema":{"type":"object","properties":{"server":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"}},"required":["server","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"606084323a559c13e000b4662535b6942dd591875c5ca53b9fb583b373933560"},"sql_server_firewall-rule_list":{"inputSchema":{"type":"object","properties":{"server":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"}},"required":["server","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"606084323a559c13e000b4662535b6942dd591875c5ca53b9fb583b373933560"},"sql_server_get":{"inputSchema":{"type":"object","properties":{"server":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"}},"required":["resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"48138d70946457dfffdc985830f0d21bdebe1751e5f9bbc98178db3c4bb7c512"}}},"storage":{"kind":"router","commands":{"storage_account_get":{"inputSchema":{"type":"object","properties":{"account":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"9c00d50c811cd5cf4bd0ccfb1ee583a1209ea64b33ebd2b9242da469a1220985"},"storage_blob_container_get":{"inputSchema":{"type":"object","properties":{"account":{"type":"string"},"container":{"type":"string"},"prefix":{"type":"string"},"tenant":{"type":"string"}},"required":["account"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"b1c1d53f485b0f745047cc0e410a87a3bb85208af41aeca215aad33cbfbfc33d"},"storage_blob_get":{"inputSchema":{"type":"object","properties":{"blob":{"type":"string"},"prefix":{"type":"string"},"account":{"type":"string"},"container":{"type":"string"},"tenant":{"type":"string"}},"required":["account","container"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"20c4d96b95f8c2d7ba8d63a86bc73e8fb8f90b534881f5b051956864af042a2a"},"storage_table_list":{"inputSchema":{"type":"object","properties":{"account":{"type":"string"},"tenant":{"type":"string"}},"required":["account"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2c2f502c227162734f1e59cc3abe8c2d0d2e8b8a1a21d2a677c4565166389599"}}},"storagesync":{"kind":"router","commands":{"storagesync_cloudendpoint_get":{"inputSchema":{"type":"object","properties":{"name":{"type":"string"},"sync-group-name":{"type":"string"},"cloud-endpoint-name":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["name","sync-group-name","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"d74b40f4abcab93912f245731c4a50ddee52ed6d3deeed5b6449ea50eeca4ed1"},"storagesync_registeredserver_get":{"inputSchema":{"type":"object","properties":{"name":{"type":"string"},"server-id":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["name","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"a60d4306855cf884e436369583fb639a7d0b66c1d2ab4dee9283a9688dac7993"},"storagesync_serverendpoint_get":{"inputSchema":{"type":"object","properties":{"name":{"type":"string"},"sync-group-name":{"type":"string"},"server-endpoint-name":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["name","sync-group-name","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"6aa7faf0284b81c92ac9f5cfe148999b2d2d7aff6bc5c5fc0c45a85f0afa0e30"},"storagesync_service_get":{"inputSchema":{"type":"object","properties":{"name":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"3ba3a101b737b8a8b65436f9415e6d3b5a5abde237f5c71cb054e711a3c0ba21"},"storagesync_syncgroup_get":{"inputSchema":{"type":"object","properties":{"name":{"type":"string"},"sync-group-name":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["name","resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"a9112b4efc69c560bb5754e1199c63efbf3219c62222ea2d7651384d58af3b57"}}},"virtualdesktop":{"kind":"router","commands":{"virtualdesktop_hostpool_host_list":{"inputSchema":{"type":"object","properties":{"hostpool":{"type":"string"},"hostpool-resource-id":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"6cbc0f068c409c12c0eece3d84d97829cc221bfad849a3f0a8ff0f50da63bf46"},"virtualdesktop_hostpool_host_user-list":{"inputSchema":{"type":"object","properties":{"sessionhost":{"type":"string"},"hostpool":{"type":"string"},"hostpool-resource-id":{"type":"string"},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["sessionhost"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"0b47ed47f5fa7342e25ee201b426a40ba4e7837b6f88c4425a6210fc96600429"},"virtualdesktop_hostpool_list":{"inputSchema":{"type":"object","properties":{"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2be475a9f482b43f39a5d26ca7502301d0da20b6bcbbbc98329607b4565aee4d"}}},"wellarchitectedframework":{"kind":"router","commands":{"wellarchitectedframework_serviceguide_get":{"inputSchema":{"type":"object","properties":{"service":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"cead78911fcbbdab02d576135134b8e0da07112409f50ae691c4075357aa8f7c"}}},"workbooks":{"kind":"router","commands":{"workbooks_list":{"inputSchema":{"type":"object","properties":{"kind":{"type":"string"},"category":{"type":"string"},"source-id":{"type":"string"},"name-contains":{"type":"string"},"modified-after":{"type":"string"},"output-format":{"type":"string"},"max-results":{"type":["integer","null"]},"include-total-count":{"type":["boolean","null"]},"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"597db28e8231876be7f9a41c85c95b6e4e938a357553f3f47d8320bfbd303b8b"},"workbooks_show":{"inputSchema":{"type":"object","properties":{"workbook-ids":{"type":"array","items":{"type":"string"}},"tenant":{"type":"string"}},"required":["workbook-ids"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"bb6138cbfde9f8b82103065b343dc2efb0115af39f34128eb357dbeb57679539"}}},"kusto":{"kind":"router","commands":{"kusto_cluster_get":{"inputSchema":{"type":"object","properties":{"cluster":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["cluster"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"a6e7d3c9e204875b439920ad1a4fccd18f0ec8532014ab6c793a224225934acf"},"kusto_cluster_list":{"inputSchema":{"type":"object","properties":{"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"2be475a9f482b43f39a5d26ca7502301d0da20b6bcbbbc98329607b4565aee4d"},"kusto_database_list":{"inputSchema":{"type":"object","properties":{"cluster-uri":{"type":"string"},"cluster":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"74e6022318e37c1acfc3f16d360baca6d1ec2919dd2c44e03ae6c09576d75bc5"},"kusto_sample":{"inputSchema":{"type":"object","properties":{"limit":{"type":["integer","null"]},"table":{"type":"string"},"database":{"type":"string"},"cluster-uri":{"type":"string"},"cluster":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["table","database"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"f6b5edbfb29b31f3f6860f253cea0bc02068cf071ea0259e3beef851d0b7d710"},"kusto_table_list":{"inputSchema":{"type":"object","properties":{"database":{"type":"string"},"cluster-uri":{"type":"string"},"cluster":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["database"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"086180c26f9cebbf0f5728bb51c9a766f46f0d366a246e605bd27c69f1497e91"},"kusto_table_schema":{"inputSchema":{"type":"object","properties":{"table":{"type":"string"},"database":{"type":"string"},"cluster-uri":{"type":"string"},"cluster":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["table","database"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"739e0444ea7c1ba0787a4303063745376cdeac3100c63fb684b6141a81b1f39c"}}},"subscription_list":{"kind":"direct","inputSchema":{"type":"object","properties":{"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"a9f87905941ef515619671fd12f81430a4cddbc1f820a768955f696d38c15349"},"group_list":{"kind":"direct","inputSchema":{"type":"object","properties":{"subscription":{"type":"string"},"tenant":{"type":"string"}},"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"970c15caf5676ac233109f325d09a72647772c500356919a79a4aac132dd6a67"},"group_resource_list":{"kind":"direct","inputSchema":{"type":"object","properties":{"resource-group":{"type":"string"},"subscription":{"type":"string"},"tenant":{"type":"string"}},"required":["resource-group"],"additionalProperties":false},"annotations":{"readOnlyHint":true,"destructiveHint":false},"capturedSchemaSha256":"e30931a6437b15e80b76abc2ff8a575c66f3021a5ebd40fdb10c365bb29e45a5"}}); // generated by build-plugin.mjs
// The server name, with "-" or "_" between its words, anywhere in a tool name.
const RETIRED_COST_SERVER_MARK = /apex[-_]azure[-_]cost/iu;
const AZURE_SERVER_MARK = /apex[-_]azure/iu;
const AZURE_TOOL_NAME = /^(?:mcp_{1,2})?apex[-_]azure(?:-|_{1,2}|\/|:|\.)([A-Za-z0-9_.-]+)$/iu;

/**
 * Lower-case agent ID without the APEX plugin namespace or file suffix: "apex:APEX.agent.md" becomes "apex". Copilot
 * names plugin agents "<plugin>:<file stem>"; other namespaces stay, so "other-plugin:apex" is not the APEX agent.
 */
export function normalizeAgentId(value) {
  if (typeof value !== "string") return "";
  const id = value
    .trim()
    .toLowerCase()
    .replace(/\.agent\.md$/u, "");
  const namespace = /^([^:/\\]+)[:/\\](.*)$/u.exec(id);
  return namespace !== null && namespace[1] === APEX_PLUGIN_NAME ? namespace[2].trim() : id;
}

export function isApexAgent(value) {
  return normalizeAgentId(value) === APEX_AGENT_ID;
}

export const REVIEW_AGENT_ID = "rubber-duck";
export const REVIEW_CAPTURE_SCHEMA = "apex-review-capture-v1";
export const REVIEW_PENDING_SCHEMA = "apex-review-pending-v1";
export const MARKER_TTL_MS = 30 * 60 * 1000;
export const TOOL_POLICY_FILE = "apex-mcp-tools.json";

export function deny(reason) {
  return { permissionDecision: "deny", permissionDecisionReason: `APEX hook: ${reason}` };
}

function apexTaskDenial(target) {
  return deny(
    `"${target}" is the user-facing APEX agent and cannot run as a task subagent. ` +
      "Continue in the APEX agent selected in the agent picker; delegate kernel tasks only to hidden APEX workers.",
  );
}

export function isRetiredCostServerTool(toolName) {
  return typeof toolName === "string" && RETIRED_COST_SERVER_MARK.test(toolName.trim());
}

function denyRetiredCostServer({ toolName }) {
  return isRetiredCostServerTool(toolName)
    ? deny(`"${toolName}" targets the retired apex-azure-cost server and is blocked before transport.`)
    : null;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function azureTool(toolName) {
  if (typeof toolName !== "string" || isRetiredCostServerTool(toolName)) return undefined;
  const name = toolName.trim();
  if (!AZURE_SERVER_MARK.test(name)) return undefined;
  return AZURE_TOOL_NAME.exec(name)?.[1] ?? "";
}

function azureDenial(toolName) {
  return deny(
    `"${toolName}" is not an approved Azure namespace command with valid arguments. ` +
      "Use an exact reviewed command and parameters, or pure learn with intent empty and no command or parameters.",
  );
}

// Captured input schemas use only this bounded vocabulary. Unsupported shapes fail closed.
export function matchesInput(schema, value) {
  if (!isObject(schema)) return false;
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (
    !types.some((type) =>
      type === "object"
        ? isObject(value)
        : type === "array"
          ? Array.isArray(value)
          : type === "integer"
            ? Number.isInteger(value)
            : type === "number"
              ? typeof value === "number" && Number.isFinite(value)
              : type === "null"
                ? value === null
                : ["string", "boolean"].includes(type) && typeof value === type,
    )
  )
    return false;
  if (schema.enum && !schema.enum.includes(value)) return false;
  if (
    schema.format === "date-time" &&
    typeof value === "string" &&
    (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/u.test(value) ||
      !Number.isFinite(Date.parse(value)))
  )
    return false;
  if (Array.isArray(value)) return value.every((item) => matchesInput(schema.items, item));
  if (!isObject(value)) return true;
  const properties = schema.properties ?? {};
  if ((schema.required ?? []).some((key) => !Object.hasOwn(value, key))) return false;
  return Object.entries(value).every(([key, child]) =>
    Object.hasOwn(properties, key) ? matchesInput(properties[key], child) : false,
  );
}

function denyAzureCommand({ toolName, args, argsValid = true }) {
  const tool = azureTool(toolName);
  if (tool === undefined) return null;
  if (!argsValid || !Object.hasOwn(AZURE_COMMAND_POLICY, tool)) return azureDenial(toolName);
  const namespace = AZURE_COMMAND_POLICY[tool];
  if (namespace.kind === "direct") return matchesInput(namespace.inputSchema, args) ? null : azureDenial(toolName);
  if (
    !isObject(args) ||
    Object.keys(args).some((key) => !["intent", "command", "parameters", "learn"].includes(key)) ||
    typeof args.intent !== "string"
  )
    return azureDenial(toolName);
  if (args.learn === true)
    return args.intent === "" && !Object.hasOwn(args, "command") && !Object.hasOwn(args, "parameters")
      ? null
      : azureDenial(toolName);
  if (
    (Object.hasOwn(args, "learn") && args.learn !== false) ||
    typeof args.command !== "string" ||
    !Object.hasOwn(namespace.commands, args.command)
  )
    return azureDenial(toolName);
  return matchesInput(namespace.commands[args.command].inputSchema, args.parameters ?? {}) &&
    (!Object.hasOwn(args, "parameters") || isObject(args.parameters))
    ? null
    : azureDenial(toolName);
}

/**
 * Normalizes the documented camelCase payload ({ toolName, toolArgs }) and the VS Code compatible snake_case payload
 * ({ tool_name, tool_input }). toolArgs may arrive as an object or as a JSON string. Throws on unreadable JSON.
 */
export function readPayload(text) {
  const payload = JSON.parse(text.replace(/^\uFEFF/u, ""));
  if (!isObject(payload)) throw new Error("hook payload is not a JSON object");
  let args = Object.hasOwn(payload, "toolArgs")
    ? payload.toolArgs
    : Object.hasOwn(payload, "tool_input")
      ? payload.tool_input
      : {};
  if (typeof args === "string") args = JSON.parse(args);
  return {
    payload,
    toolName: String(payload.toolName ?? payload.tool_name ?? ""),
    args: isObject(args) ? args : {},
    argsValid: isObject(args),
  };
}

/** Finds tool names in text that is not valid JSON, including JSON-escaped payloads. */
export function scanToolNames(text) {
  return [...text.matchAll(/\\*"(?:toolName|tool_name)\\*"\s*:\s*\\*"([^"\\]*)\\*"/gu)].map((match) => match[1]);
}

/** Finds agent_type values in text that is not valid JSON, including JSON-escaped toolArgs strings. */
export function scanTaskTargets(text) {
  if (!/\\*"(?:toolName|tool_name)\\*"\s*:\s*\\*"(?:task|Task|Agent)\\*"/u.test(text)) return [];
  return [...text.matchAll(/\\*"(?:agent_type|agentType)\\*"\s*:\s*\\*"([^"\\]*)\\*"/gu)].map((match) => match[1]);
}

function denyApexTaskTarget({ toolName, args }) {
  if (!TASK_TOOLS.has(toolName)) return null;
  const target = args.agent_type ?? args.agentType;
  return isApexAgent(target) ? apexTaskDenial(target) : null;
}

const sha256 = (text) => createHash("sha256").update(text, "utf8").digest("hex");

/** Same rule as the kernel: `$APEX_REVIEW_HOME` when absolute, else `~/.apex/reviews`. */
export function reviewHome(env = process.env) {
  const configured = env.APEX_REVIEW_HOME;
  if (typeof configured === "string" && configured.length > 0) {
    if (!isAbsolute(configured)) throw new Error("APEX_REVIEW_HOME must be an absolute path");
    return resolve(configured);
  }
  return join(homedir(), ".apex", "reviews");
}

/** The nonce from the first non-empty prompt line `APEX-REVIEW: nonce=<32 hex>`, or undefined. */
export function reviewNonce(prompt) {
  if (typeof prompt !== "string") return undefined;
  const first = prompt
    .replace(/^\uFEFF/u, "")
    .split(/\r?\n/u)
    .find((line) => line.trim().length > 0);
  return /^APEX-REVIEW:\s+nonce=([0-9a-f]{32})\s*$/u.exec(first?.trim() ?? "")?.[1];
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (isObject(value))
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  return JSON.stringify(value);
}

function plainDirectory(path, create) {
  let stat = lstatSync(path, { throwIfNoEntry: false });
  if (stat === undefined && create) {
    mkdirSync(path, { recursive: true, mode: 0o700 });
    stat = lstatSync(path);
  }
  if (stat === undefined) return false;
  if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`not a plain directory: ${path}`);
  // Same rule as the kernel: another OS user who can write here could replace the key, captures or run marks.
  if (process.platform !== "win32" && typeof process.getuid === "function") {
    if (stat.uid !== process.getuid()) throw new Error(`review folder is owned by another user: ${path}`);
    if ((stat.mode & 0o022) !== 0) throw new Error(`review folder is writable by other users: ${path}`);
    assertTrustedAncestors(path);
  }
  return true;
}

/** Owned by you or root, and not writable by group or others unless sticky (as /tmp is). Same rule as the kernel. */
function assertTrustedFolder(path) {
  const stat = lstatSync(path);
  const uid = process.getuid();
  if ((stat.uid !== uid && stat.uid !== 0) || ((stat.mode & 0o022) !== 0 && (stat.mode & 0o1000) === 0))
    throw new Error(`a folder above the review home lets another user replace it: ${path}`);
}

/** Every real ancestor, and the folder holding each symbolic link in the configured path, must be trusted. */
function assertTrustedAncestors(path) {
  for (let current = dirname(realpathSync(path)); ; current = dirname(current)) {
    assertTrustedFolder(current);
    if (dirname(current) === current) break;
  }
  for (let prefix = dirname(resolve(path)); dirname(prefix) !== prefix; prefix = dirname(prefix)) {
    if (!lstatSync(prefix).isSymbolicLink()) continue;
    for (let current = realpathSync(dirname(prefix)); ; current = dirname(current)) {
      assertTrustedFolder(current);
      if (dirname(current) === current) break;
    }
  }
}

/**
 * Publishes a new, fully written file: the content goes to a private temporary name, which is then hard-linked to the
 * final name (fails if that exists, so nothing is replaced) and removed. Readers never see a partial file. Returns
 * false when the exact file already exists; throws when a different one does (the existing file wins).
 */
function writeNewFile(path, text, mode = 0o600) {
  const temporary = join(dirname(path), `.${randomBytes(8).toString("hex")}.tmp`);
  const descriptor = openSync(temporary, "wx", mode);
  try {
    writeSync(descriptor, text);
  } finally {
    closeSync(descriptor);
  }
  try {
    linkSync(temporary, path);
    return true;
  } catch (error) {
    if (error.code === "EEXIST" && readFileSync(path, "utf8") === text) return false;
    throw error;
  } finally {
    rmSync(temporary, { force: true });
  }
}

/** Reads, or creates with 0600 permissions, the per-user key the kernel uses to verify captures. */
export function captureKey(home) {
  plainDirectory(home, true);
  const path = join(home, "capture.key");
  try {
    writeNewFile(path, `${randomBytes(32).toString("hex")}\n`);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
  const info = lstatSync(path);
  if (info.isSymbolicLink() || !info.isFile()) throw new Error(`review capture key is not a regular file: ${path}`);
  if (process.platform !== "win32" && (info.mode & 0o077) !== 0)
    throw new Error(`review capture key permissions must be 0600: ${path}`);
  const text = readFileSync(path, "utf8").trim();
  if (!/^[0-9a-f]{64}$/u.test(text)) throw new Error(`review capture key is malformed: ${path}`);
  return Buffer.from(text, "hex");
}

function isRubberDuck(value) {
  return typeof value === "string" && value.trim().toLowerCase() === REVIEW_AGENT_ID;
}

function taskAgentType(args) {
  return args.agent_type ?? args.agentType;
}

function toolResultText(payload) {
  const result = payload.toolResult ?? payload.tool_result;
  const text = typeof result === "string" ? result : (result?.textResultForLlm ?? result?.text_result_for_llm);
  const resultType = isObject(result) ? (result.resultType ?? result.result_type) : undefined;
  return typeof text !== "string" || (resultType !== undefined && resultType !== "success") ? undefined : text;
}

const sign = (record, key) => createHmac("sha256", key).update(canonicalJson(record)).digest("hex");

/** Signs and publishes one capture record, exactly as the kernel expects to verify it. */
function writeCapture(home, key, { nonce, sessionId, toolName, agentType, prompt, response }, now) {
  const record = {
    schema: REVIEW_CAPTURE_SCHEMA,
    nonce,
    sessionId,
    toolName,
    agentType,
    prompt,
    requestSha256: sha256(prompt),
    response,
    responseSha256: sha256(response),
    capturedAt: now.toISOString(),
  };
  record.signature = sign(record, key);
  const directory = join(home, "captures");
  plainDirectory(directory, true);
  writeNewFile(join(directory, `${nonce}-${record.responseSha256.slice(0, 16)}.json`), `${JSON.stringify(record)}\n`);
}

// A review's agent ID, as in "agent_id: <id>". Letters, digits, "_" and "-" only, so it is safe as a file name.
const AGENT_ID_PATTERN = /^[0-9A-Za-z][0-9A-Za-z_-]{0,63}$/u;
const REVIEW_FENCE_LINE = /^[ \t]*(?:`{3,}|~{3,})[ \t]*apex-review[ \t]*\r?$/mu;
const AGENT_COMPLETED_LINE = /^\s*Agent completed\b/u;

/** The agent ID of a "moved to background" notice, "" when it names none, `null` for any other text. */
function backgroundNoticeAgentId(text) {
  if (!/Agent moved to background/u.test(text) || REVIEW_FENCE_LINE.test(text)) return null;
  return /\bagent_id:\s*([0-9A-Za-z][0-9A-Za-z_-]{0,63})(?![0-9A-Za-z_-])/u.exec(text)?.[1] ?? "";
}

/**
 * postToolUse: save a kernel-requested rubber-duck review exactly as the parent received it. Other rubber-duck calls
 * and failed results are not captured. A call that Copilot moved to the background returns only a start notice: it
 * leaves a signed pending record, which ingestBackgroundReview turns into the capture once `read_agent` returns the
 * finished review. Never blocks.
 */
export function captureRubberDuckReview({ payload, toolName, args }, { env = process.env, now = new Date() } = {}) {
  if (!TASK_TOOLS.has(toolName) || !isRubberDuck(taskAgentType(args))) return null;
  const nonce = reviewNonce(args.prompt);
  if (nonce === undefined) return null;
  if (args.mode === "background")
    throw new Error("a background rubber-duck review is not captured; run it in sync mode");
  const response = toolResultText(payload);
  if (response === undefined) return null;
  const home = reviewHome(env);
  const key = captureKey(home);
  const sessionId = typeof payload.sessionId === "string" ? payload.sessionId : (payload.session_id ?? null);
  const agentId = backgroundNoticeAgentId(response);
  if (agentId !== null) {
    if (!AGENT_ID_PATTERN.test(agentId) || typeof sessionId !== "string" || sessionId === "") return null;
    const pending = {
      schema: REVIEW_PENDING_SCHEMA,
      nonce,
      sessionId,
      agentId,
      toolName,
      agentType: taskAgentType(args),
      prompt: args.prompt,
      requestSha256: sha256(args.prompt),
      createdAt: now.toISOString(),
    };
    pending.signature = sign(pending, key);
    const directory = join(home, "pending");
    plainDirectory(directory, true);
    writeNewFile(join(directory, `${agentId}.json`), `${JSON.stringify(pending)}\n`);
    return null;
  }
  writeCapture(
    home,
    key,
    { nonce, sessionId, toolName, agentType: taskAgentType(args), prompt: args.prompt, response },
    now,
  );
  return null;
}

/** The pending record for this agent, or undefined unless it is signed, intact and from this session. */
function readPendingReview(home, agentId, sessionId) {
  const directory = join(home, "pending");
  if (!plainDirectory(directory, false)) return undefined;
  const path = join(directory, `${agentId}.json`);
  const info = lstatSync(path, { throwIfNoEntry: false });
  if (info === undefined || info.isSymbolicLink() || !info.isFile() || info.size > 1024 * 1024) return undefined;
  if (process.platform !== "win32" && ((info.mode & 0o077) !== 0 || info.uid !== process.getuid())) return undefined;
  let record;
  try {
    record = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return undefined;
  }
  if (!isObject(record) || typeof record.signature !== "string" || !/^[0-9a-f]{64}$/u.test(record.signature))
    return undefined;
  const { signature, ...unsigned } = record;
  const expected = Buffer.from(sign(unsigned, captureKey(home)), "hex");
  if (!timingSafeEqual(expected, Buffer.from(signature, "hex"))) return undefined;
  if (
    record.schema !== REVIEW_PENDING_SCHEMA ||
    record.agentId !== agentId ||
    record.sessionId !== sessionId ||
    typeof record.prompt !== "string" ||
    record.requestSha256 !== sha256(record.prompt) ||
    record.nonce !== reviewNonce(record.prompt) ||
    !TASK_TOOLS.has(record.toolName) ||
    !isRubberDuck(record.agentType)
  )
    return undefined;
  return { record, path };
}

/**
 * postToolUse for `read_agent`: when it returns the finished review of a pending background rubber-duck run (same
 * session, signed record, same agent ID), save the capture as the synchronous path does and remove the pending record.
 * A result without an apex-review block, or one that does not begin with the host's "Agent completed" status line
 * (a running agent can already show a draft block), is ignored and leaves the pending record for the next read.
 */
export function ingestBackgroundReview({ payload, toolName, args }, { env = process.env, now = new Date() } = {}) {
  if (toolName !== "read_agent" || typeof args.agent_id !== "string" || !AGENT_ID_PATTERN.test(args.agent_id))
    return null;
  const sessionId = sessionOf(payload);
  const response = toolResultText(payload);
  if (
    sessionId === "" ||
    response === undefined ||
    !AGENT_COMPLETED_LINE.test(response) ||
    !REVIEW_FENCE_LINE.test(response)
  )
    return null;
  const home = reviewHome(env);
  if (!plainDirectory(home, false)) return null;
  const pending = readPendingReview(home, args.agent_id, sessionId);
  if (pending === undefined) return null;
  const key = captureKey(home);
  const { nonce, toolName: pendingTool, agentType, prompt } = pending.record;
  writeCapture(home, key, { nonce, sessionId, toolName: pendingTool, agentType, prompt, response }, now);
  rmSync(pending.path, { force: true });
  return null;
}

function sessionOf(payload) {
  const value = payload.sessionId ?? payload.session_id;
  return typeof value === "string" ? value : "";
}

function folderOf(payload) {
  return typeof payload.cwd === "string" ? resolve(payload.cwd) : "";
}

function markerDirectory(env) {
  return join(reviewHome(env), "active");
}

/**
 * Active, unexpired rubber-duck marks; expired marks are removed. Marks are published by atomic rename, so a mark that
 * does not parse was damaged: until its file is older than the TTL it applies to every folder (cwd null), failing closed.
 */
export function activeRubberDuckMarks({ env = process.env, now = Date.now() } = {}) {
  const directory = markerDirectory(env);
  // The home is checked too: whoever can write it could rename the whole folder away.
  if (!plainDirectory(reviewHome(env), false) || !plainDirectory(directory, false)) return [];
  const marks = [];
  for (const name of readdirSync(directory).sort()) {
    if (!name.endsWith(".json")) continue;
    const path = join(directory, name);
    let mark;
    try {
      mark = JSON.parse(readFileSync(path, "utf8"));
    } catch {
      mark = undefined;
    }
    const valid =
      isObject(mark) &&
      typeof mark.parentSessionId === "string" &&
      typeof mark.cwd === "string" &&
      Number.isFinite(Date.parse(mark.startedAt));
    const startedAt = valid ? Date.parse(mark.startedAt) : (lstatSync(path, { throwIfNoEntry: false })?.mtimeMs ?? 0);
    if (now - startedAt > MARKER_TTL_MS) {
      rmSync(path, { force: true });
      continue;
    }
    marks.push(valid ? { ...mark, path } : { parentSessionId: null, cwd: null, startedAt, path });
  }
  return marks;
}

/** subagentStart: mark a rubber-duck run as active for its parent session and folder. */
export function markRubberDuckStart({ payload }, { env = process.env, now = new Date() } = {}) {
  if (!isRubberDuck(payload.agentName ?? payload.agent_name)) return null;
  const directory = markerDirectory(env);
  plainDirectory(reviewHome(env), true);
  plainDirectory(directory, true);
  const mark = { parentSessionId: sessionOf(payload), cwd: folderOf(payload), startedAt: now.toISOString() };
  writeNewFile(join(directory, `${now.getTime()}-${randomBytes(6).toString("hex")}.json`), JSON.stringify(mark));
  return null;
}

function denialDirectory(env) {
  return join(reviewHome(env), "denied");
}

/**
 * Records that preToolUse denied a rubber-duck `task` call, so the postToolUseFailure event the client then sends for
 * that call does not clear the mark of the run that is still going. A null session or folder matches any (fail-safe
 * denials of unreadable input). Recording never blocks the denial.
 */
function recordRubberDuckDenial(sessionId, cwd, { env = process.env, now = new Date() } = {}) {
  try {
    const directory = denialDirectory(env);
    plainDirectory(reviewHome(env), true);
    plainDirectory(directory, true);
    const denial = { sessionId, cwd, deniedAt: now.toISOString() };
    writeNewFile(join(directory, `${now.getTime()}-${randomBytes(6).toString("hex")}.json`), JSON.stringify(denial));
  } catch {
    // Without a record, the call's failure event would clear a live mark. Duplicate the marks it could clear instead,
    // so one unmatched failure still leaves each run marked; duplicates add no new parent, so no session gains the
    // parent exemption. If the mark directory cannot take them either, a failure event cannot remove a mark from it.
    try {
      for (const mark of activeRubberDuckMarks({ env, now: now.getTime() }))
        if (
          typeof mark.parentSessionId === "string" &&
          (sessionId === null || mark.parentSessionId === sessionId) &&
          (cwd === null || mark.cwd === cwd)
        )
          writeNewFile(
            join(markerDirectory(env), `${Date.parse(mark.startedAt)}-${randomBytes(6).toString("hex")}.json`),
            JSON.stringify({ parentSessionId: mark.parentSessionId, cwd: mark.cwd, startedAt: mark.startedAt }),
          );
    } catch {
      // The call is still denied, and the kernel's pending-review guard still refuses approve, delete and publish.
    }
  }
}

/**
 * Consumes the oldest unexpired denial record for this session and folder. Expired and unreadable records are removed.
 * Returns true when the failure belongs to a denied call rather than to a rubber-duck run.
 */
export function consumeRubberDuckDenial(payload, { env = process.env, now = Date.now() } = {}) {
  const directory = denialDirectory(env);
  if (!plainDirectory(reviewHome(env), false) || !plainDirectory(directory, false)) return false;
  for (const name of readdirSync(directory).sort()) {
    if (!name.endsWith(".json")) continue;
    const path = join(directory, name);
    let denial;
    try {
      denial = JSON.parse(readFileSync(path, "utf8"));
    } catch {
      denial = undefined;
    }
    const deniedAt = isObject(denial) ? Date.parse(denial.deniedAt) : Number.NaN;
    if (!Number.isFinite(deniedAt) || now - deniedAt > MARKER_TTL_MS) {
      rmSync(path, { force: true });
      continue;
    }
    if (
      (denial.sessionId === null || denial.sessionId === sessionOf(payload)) &&
      (denial.cwd === null || denial.cwd === folderOf(payload))
    ) {
      rmSync(path, { force: true });
      return true;
    }
  }
  return false;
}

/**
 * subagentStop and postToolUseFailure: clear the oldest mark of this parent session and folder. A failure event for a
 * rubber-duck call that preToolUse denied consumes that denial instead, so a denied duplicate cannot clear the mark.
 */
export function clearRubberDuckMark({ payload, toolName, args }, { env = process.env } = {}) {
  const agent = toolName === "" ? (payload.agentName ?? payload.agentType ?? payload.agent_name) : taskAgentType(args);
  if (toolName !== "" && !TASK_TOOLS.has(toolName)) return null;
  if (!isRubberDuck(agent)) return null;
  if (toolName !== "" && consumeRubberDuckDenial(payload, { env })) return null;
  const mark = activeRubberDuckMarks({ env }).find(
    (candidate) => candidate.parentSessionId === sessionOf(payload) && candidate.cwd === folderOf(payload),
  );
  if (mark !== undefined) rmSync(mark.path, { force: true });
  return null;
}

/** "apex-status", "apex/status" and "mcp__apex__status" all name the APEX server's `status` tool. */
export function apexToolName(toolName) {
  return /^(?:apex[-/]|mcp__apex__)([A-Za-z][A-Za-z0-9]*)$/u.exec(toolName)?.[1];
}

/** Read-only APEX tools from the shipped policy. Throws when the policy is missing or malformed. */
export function loadToolPolicy(path = join(dirname(fileURLToPath(import.meta.url)), TOOL_POLICY_FILE)) {
  const policy = JSON.parse(readFileSync(path, "utf8"));
  if (
    !isObject(policy) ||
    policy.server !== APEX_PLUGIN_NAME ||
    !Array.isArray(policy.readOnly) ||
    !policy.readOnly.every((name) => typeof name === "string")
  )
    throw new Error(`malformed ${TOOL_POLICY_FILE}`);
  return new Set(policy.readOnly);
}

/**
 * preToolUse: while a rubber-duck run is active in this folder, deny state-changing APEX tools called by any session
 * other than the run's parent. Unknown APEX tools count as state-changing; an unreadable policy or mark store denies.
 */
export function denyApexMutationDuringRubberDuck(
  { payload, toolName },
  { env = process.env, readOnlyTools = () => loadToolPolicy() } = {},
) {
  const tool = apexToolName(toolName);
  if (tool === undefined) return null;
  let marks;
  try {
    marks = activeRubberDuckMarks({ env });
  } catch (error) {
    return deny(`cannot read rubber-duck run marks (${error.message}), so APEX tool "${tool}" is blocked.`);
  }
  const folder = folderOf(payload);
  const session = sessionOf(payload);
  const folderMarks = marks.filter((mark) => mark.cwd === null || mark.cwd === folder);
  // A session that started a rubber-duck run in this folder is a parent APEX agent, even when another parent's run is
  // also active; only sessions that own no mark (subagents and workers) are denied.
  if (folderMarks.length === 0 || folderMarks.some((mark) => mark.parentSessionId === session)) return null;
  let readOnly;
  try {
    readOnly = readOnlyTools();
  } catch {
    readOnly = new Set();
  }
  if (readOnly.has(tool)) return null;
  return deny(
    `APEX tool "${tool}" changes state and is blocked while a rubber-duck review runs in this folder. ` +
      "Rubber-duck only reviews: read the listed files and reply with the apex-review block.",
  );
}

/**
 * preToolUse: one rubber-duck run per folder at a time. A rubber-duck subagent therefore cannot start its own run and
 * become an exempt parent, and each parent owns at most one mark, so a duplicate stop or failure event for one run
 * cannot clear the mark of another run that is still going.
 */
export function denyNestedRubberDuck({ payload, toolName, args }, { env = process.env } = {}) {
  if (!TASK_TOOLS.has(toolName) || !isRubberDuck(taskAgentType(args))) return null;
  let marks;
  try {
    marks = activeRubberDuckMarks({ env });
  } catch (error) {
    return deny(`cannot read rubber-duck run marks (${error.message}), so the rubber-duck call is blocked.`);
  }
  if (!marks.some((mark) => mark.cwd === null || mark.cwd === folderOf(payload))) return null;
  recordRubberDuckDenial(sessionOf(payload), folderOf(payload), { env });
  return deny("a rubber-duck review is already running in this folder; wait for it to finish before starting another.");
}

/** Handlers per event. The first handler that returns a decision wins; capture and mark handlers never decide. */
export const handlers = Object.freeze({
  preToolUse: Object.freeze([
    denyApexTaskTarget,
    denyRetiredCostServer,
    denyAzureCommand,
    denyNestedRubberDuck,
    denyApexMutationDuringRubberDuck,
  ]),
  postToolUse: Object.freeze([captureRubberDuckReview, ingestBackgroundReview]),
  postToolUseFailure: Object.freeze([clearRubberDuckMark]),
  subagentStart: Object.freeze([markRubberDuckStart]),
  subagentStop: Object.freeze([clearRubberDuckMark]),
});

/**
 * Fallback for unreadable input: the deny rules apply to what the raw text shows. A task target readable as APEX is
 * denied. Every protected Azure call is denied because unreadable arguments cannot prove authorization.
 * While any rubber-duck run is marked active (or the marks cannot be
 * read), an APEX tool call or a rubber-duck task call is denied.
 */
function failSafe(event, text) {
  if (event !== "preToolUse") return null;
  const targets = scanTaskTargets(text);
  const target = targets.find(isApexAgent);
  if (target !== undefined) return apexTaskDenial(target);
  const names = scanToolNames(text);
  for (const name of names) {
    if (isRetiredCostServerTool(name))
      return deny(`"${name}" targets the retired apex-azure-cost server and is blocked before transport.`);
    if (azureTool(name) !== undefined) return azureDenial(name);
  }
  if (names.length === 0 && RETIRED_COST_SERVER_MARK.test(text))
    return deny("apex-azure-cost targets a retired server and is blocked before transport.");
  if (names.length === 0 && AZURE_SERVER_MARK.test(text)) return azureDenial("apex-azure");
  const tool = names.map(apexToolName).find((name) => name !== undefined);
  const rubberDuck = targets.some(isRubberDuck);
  if (tool === undefined && !rubberDuck) return null;
  try {
    if (activeRubberDuckMarks().length === 0) return null;
  } catch {
    // An unreadable mark store cannot prove that no rubber-duck run is active.
  }
  if (rubberDuck) recordRubberDuckDenial(null, null);
  return deny(
    tool === undefined
      ? "unreadable rubber-duck task call is blocked while a rubber-duck review may be running."
      : `unreadable call to APEX tool "apex-${tool}" is blocked while a rubber-duck review may be running.`,
  );
}

/** One-line JSON with every non-ASCII character escaped, so a shell that re-encodes stdout cannot corrupt it. */
export function serialize(decision) {
  const escape = (unit) => `\\u${unit.toString(16).padStart(4, "0")}`;
  return JSON.stringify(decision).replace(/[^\t\n\r\u0020-\u007e]/gu, (character) =>
    character.length === 1
      ? escape(character.charCodeAt(0))
      : escape(character.charCodeAt(0)) + escape(character.charCodeAt(1)),
  );
}

/** Returns the stdout text for one hook call: a decision object, or "" for the client's default behaviour. */
export function run(event, text, { stderr = process.stderr } = {}) {
  if (!Object.hasOwn(handlers, event)) return "";
  const eventHandlers = handlers[event];
  let context;
  try {
    context = readPayload(text);
  } catch (error) {
    const decision = failSafe(event, text);
    stderr.write(`APEX hook: unreadable ${event} payload (${error.message}); ${decision ? "denied" : "allowed"}.\n`);
    return decision ? serialize(decision) : "";
  }
  for (const handler of eventHandlers) {
    try {
      const decision = handler(context);
      if (decision) return serialize(decision);
    } catch (error) {
      const decision = failSafe(event, text);
      stderr.write(
        event === "preToolUse"
          ? `APEX hook: ${event} check failed (${error.message}); ${decision ? "denied" : "allowed"}.\n`
          : `APEX hook: ${event} handler failed (${error.message}).\n`,
      );
      if (decision) return serialize(decision);
    }
  }
  return "";
}

async function readStdin() {
  let text = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) text += chunk;
  return text;
}

function invokedDirectly() {
  try {
    return (
      process.argv[1] !== undefined && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
    );
  } catch {
    return false;
  }
}

if (invokedDirectly()) {
  let text = "";
  try {
    text = await readStdin();
  } catch (error) {
    process.stderr.write(`APEX hook: cannot read stdin (${error.message}).\n`);
  }
  const output = run(process.argv[2] ?? "", text);
  if (output) process.stdout.write(`${output}\n`);
  process.exitCode = 0;
}
