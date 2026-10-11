# Preserved Content Index

Pinned source: `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.

Read [the authority boundary](kernel-boundary.md), then load only the topic required by accepted task inputs.
The index preserves progressive disclosure; these are design references, not capability registrations.
Native Terraform CLI with exact saved plans is the Terraform path; azd is the planned Bicep-only executor (CP-26) and
is not available today. Source document outlines never create a second state or renderer contract.

## references

- [`references/analyze.md`](../references/analyze.md)
- [`references/apim.md`](../references/apim.md)
- [`references/architecture.md`](../references/architecture.md)
- [`references/aspire.md`](../references/aspire.md)
- [`references/azure-context.md`](../references/azure-context.md)
- [`references/generate.md`](../references/generate.md)
- [`references/global-rules.md`](../references/global-rules.md)
- [`references/phases.md`](../references/phases.md)
- [`references/plan-template.md`](../references/plan-template.md)
- [`references/preparation-lineage.md`](../references/preparation-lineage.md)
- [`references/recipe-selection.md`](../references/recipe-selection.md)
- [`references/region-availability.md`](../references/region-availability.md)
- [`references/requirements.md`](../references/requirements.md)
- [`references/research.md`](../references/research.md)
- [`references/resources-limits-quotas.md`](../references/resources-limits-quotas.md)
- [`references/scan.md`](../references/scan.md)
- [`references/security.md`](../references/security.md)
- [`references/specialized-routing.md`](../references/specialized-routing.md)

## references/recipes/azcli

- [`references/recipes/azcli/README.md`](../references/recipes/azcli/README.md)
- [`references/recipes/azcli/commands.md`](../references/recipes/azcli/commands.md)
- [`references/recipes/azcli/scripts.md`](../references/recipes/azcli/scripts.md)

## references/recipes/azd

- [`references/recipes/azd/README.md`](../references/recipes/azd/README.md)
- [`references/recipes/azd/aspire.md`](../references/recipes/azd/aspire.md)
- [`references/recipes/azd/azure-yaml.md`](../references/recipes/azd/azure-yaml.md)
- [`references/recipes/azd/docker.md`](../references/recipes/azd/docker.md)
- [`references/recipes/azd/iac-rules.md`](../references/recipes/azd/iac-rules.md)
- [`references/recipes/azd/terraform.md`](../references/recipes/azd/terraform.md)

## references/recipes/bicep

- [`references/recipes/bicep/README.md`](../references/recipes/bicep/README.md)
- [`references/recipes/bicep/patterns.md`](../references/recipes/bicep/patterns.md)

## references/recipes/terraform

- [`references/recipes/terraform/README.md`](../references/recipes/terraform/README.md)
- [`references/recipes/terraform/patterns.md`](../references/recipes/terraform/patterns.md)

## references/runtimes

- [`references/runtimes/nodejs.md`](../references/runtimes/nodejs.md)

## references/sdk

- [`references/sdk/azd-deployment.md`](../references/sdk/azd-deployment.md)
- [`references/sdk/azure-appconfiguration-java.md`](../references/sdk/azure-appconfiguration-java.md)
- [`references/sdk/azure-appconfiguration-py.md`](../references/sdk/azure-appconfiguration-py.md)
- [`references/sdk/azure-appconfiguration-ts.md`](../references/sdk/azure-appconfiguration-ts.md)

## references/services/aks

- [`references/services/aks/README.md`](../references/services/aks/README.md)
- [`references/services/aks/addons.md`](../references/services/aks/addons.md)
- [`references/services/aks/bicep.md`](../references/services/aks/bicep.md)
- [`references/services/aks/manifests.md`](../references/services/aks/manifests.md)

## references/services/app-insights

- [`references/services/app-insights/README.md`](../references/services/app-insights/README.md)

## references/services/app-service

- [`references/services/app-service/README.md`](../references/services/app-service/README.md)
- [`references/services/app-service/bicep.md`](../references/services/app-service/bicep.md)
- [`references/services/app-service/custom-domains.md`](../references/services/app-service/custom-domains.md)
- [`references/services/app-service/deployment-slots.md`](../references/services/app-service/deployment-slots.md)
- [`references/services/app-service/networking.md`](../references/services/app-service/networking.md)
- [`references/services/app-service/scaling.md`](../references/services/app-service/scaling.md)
- [`references/services/app-service/sku-selection.md`](../references/services/app-service/sku-selection.md)

## references/services/container-apps

- [`references/services/container-apps/README.md`](../references/services/container-apps/README.md)
- [`references/services/container-apps/bicep.md`](../references/services/container-apps/bicep.md)
- [`references/services/container-apps/day2-operations.md`](../references/services/container-apps/day2-operations.md)
- [`references/services/container-apps/environment.md`](../references/services/container-apps/environment.md)
- [`references/services/container-apps/health-probes.md`](../references/services/container-apps/health-probes.md)
- [`references/services/container-apps/networking.md`](../references/services/container-apps/networking.md)
- [`references/services/container-apps/revisions.md`](../references/services/container-apps/revisions.md)
- [`references/services/container-apps/scaling.md`](../references/services/container-apps/scaling.md)
- [`references/services/container-apps/terraform.md`](../references/services/container-apps/terraform.md)

## references/services/cosmos-db

- [`references/services/cosmos-db/README.md`](../references/services/cosmos-db/README.md)
- [`references/services/cosmos-db/bicep.md`](../references/services/cosmos-db/bicep.md)
- [`references/services/cosmos-db/partitioning.md`](../references/services/cosmos-db/partitioning.md)
- [`references/services/cosmos-db/sdk.md`](../references/services/cosmos-db/sdk.md)

## references/services/durable-task-scheduler

- [`references/services/durable-task-scheduler/README.md`](../references/services/durable-task-scheduler/README.md)
- [`references/services/durable-task-scheduler/bicep.md`](../references/services/durable-task-scheduler/bicep.md)
- [`references/services/durable-task-scheduler/dotnet.md`](../references/services/durable-task-scheduler/dotnet.md)
- [`references/services/durable-task-scheduler/java.md`](../references/services/durable-task-scheduler/java.md)
- [`references/services/durable-task-scheduler/javascript.md`](../references/services/durable-task-scheduler/javascript.md)
- [`references/services/durable-task-scheduler/python.md`](../references/services/durable-task-scheduler/python.md)

## references/services/event-grid

- [`references/services/event-grid/README.md`](../references/services/event-grid/README.md)
- [`references/services/event-grid/bicep.md`](../references/services/event-grid/bicep.md)
- [`references/services/event-grid/subscriptions.md`](../references/services/event-grid/subscriptions.md)

## references/services/foundry

- [`references/services/foundry/README.md`](../references/services/foundry/README.md)
- [`references/services/foundry/region-availability.md`](../references/services/foundry/region-availability.md)

## references/services/functions

- [`references/services/functions/README.md`](../references/services/functions/README.md)
- [`references/services/functions/aspire-containerapps.md`](../references/services/functions/aspire-containerapps.md)
- [`references/services/functions/bicep.md`](../references/services/functions/bicep.md)
- [`references/services/functions/cold-start.md`](../references/services/functions/cold-start.md)
- [`references/services/functions/durable.md`](../references/services/functions/durable.md)
- [`references/services/functions/hosting-plans.md`](../references/services/functions/hosting-plans.md)
- [`references/services/functions/templates/README.md`](../references/services/functions/templates/README.md)
- [`references/services/functions/templates/SPEC-composable-templates.md`](../references/services/functions/templates/SPEC-composable-templates.md)
- [`references/services/functions/templates/base/eval/python.md`](../references/services/functions/templates/base/eval/python.md)
- [`references/services/functions/templates/base/eval/summary.md`](../references/services/functions/templates/base/eval/summary.md)
- [`references/services/functions/templates/http.md`](../references/services/functions/templates/http.md)
- [`references/services/functions/templates/integrations.md`](../references/services/functions/templates/integrations.md)
- [`references/services/functions/templates/mcp.md`](../references/services/functions/templates/mcp.md)
- [`references/services/functions/templates/recipes/README.md`](../references/services/functions/templates/recipes/README.md)
- [`references/services/functions/templates/recipes/blob-eventgrid/README.md`](../references/services/functions/templates/recipes/blob-eventgrid/README.md)
- [`references/services/functions/templates/recipes/blob-eventgrid/bicep/blob.bicep.md`](../references/services/functions/templates/recipes/blob-eventgrid/bicep/blob.bicep.md)
- [`references/services/functions/templates/recipes/blob-eventgrid/eval/python.md`](../references/services/functions/templates/recipes/blob-eventgrid/eval/python.md)
- [`references/services/functions/templates/recipes/blob-eventgrid/eval/summary.md`](../references/services/functions/templates/recipes/blob-eventgrid/eval/summary.md)
- [`references/services/functions/templates/recipes/blob-eventgrid/source/dotnet.md`](../references/services/functions/templates/recipes/blob-eventgrid/source/dotnet.md)
- [`references/services/functions/templates/recipes/blob-eventgrid/source/java.md`](../references/services/functions/templates/recipes/blob-eventgrid/source/java.md)
- [`references/services/functions/templates/recipes/blob-eventgrid/source/javascript.md`](../references/services/functions/templates/recipes/blob-eventgrid/source/javascript.md)
- [`references/services/functions/templates/recipes/blob-eventgrid/source/powershell.md`](../references/services/functions/templates/recipes/blob-eventgrid/source/powershell.md)
- [`references/services/functions/templates/recipes/blob-eventgrid/source/python.md`](../references/services/functions/templates/recipes/blob-eventgrid/source/python.md)
- [`references/services/functions/templates/recipes/blob-eventgrid/source/typescript.md`](../references/services/functions/templates/recipes/blob-eventgrid/source/typescript.md)
- [`references/services/functions/templates/recipes/blob-eventgrid/terraform/blob.tf.md`](../references/services/functions/templates/recipes/blob-eventgrid/terraform/blob.tf.md)
- [`references/services/functions/templates/recipes/common/dotnet-entry-point.md`](../references/services/functions/templates/recipes/common/dotnet-entry-point.md)
- [`references/services/functions/templates/recipes/common/error-handling.md`](../references/services/functions/templates/recipes/common/error-handling.md)
- [`references/services/functions/templates/recipes/common/health-check.md`](../references/services/functions/templates/recipes/common/health-check.md)
- [`references/services/functions/templates/recipes/common/nodejs-entry-point.md`](../references/services/functions/templates/recipes/common/nodejs-entry-point.md)
- [`references/services/functions/templates/recipes/common/uami-bindings.md`](../references/services/functions/templates/recipes/common/uami-bindings.md)
- [`references/services/functions/templates/recipes/composition.md`](../references/services/functions/templates/recipes/composition.md)
- [`references/services/functions/templates/recipes/cosmosdb/README.md`](../references/services/functions/templates/recipes/cosmosdb/README.md)
- [`references/services/functions/templates/recipes/cosmosdb/bicep/cosmos-network.bicep.md`](../references/services/functions/templates/recipes/cosmosdb/bicep/cosmos-network.bicep.md)
- [`references/services/functions/templates/recipes/cosmosdb/bicep/cosmos.bicep.md`](../references/services/functions/templates/recipes/cosmosdb/bicep/cosmos.bicep.md)
- [`references/services/functions/templates/recipes/cosmosdb/eval/python.md`](../references/services/functions/templates/recipes/cosmosdb/eval/python.md)
- [`references/services/functions/templates/recipes/cosmosdb/eval/summary.md`](../references/services/functions/templates/recipes/cosmosdb/eval/summary.md)
- [`references/services/functions/templates/recipes/cosmosdb/source/dotnet.md`](../references/services/functions/templates/recipes/cosmosdb/source/dotnet.md)
- [`references/services/functions/templates/recipes/cosmosdb/source/java.md`](../references/services/functions/templates/recipes/cosmosdb/source/java.md)
- [`references/services/functions/templates/recipes/cosmosdb/source/javascript.md`](../references/services/functions/templates/recipes/cosmosdb/source/javascript.md)
- [`references/services/functions/templates/recipes/cosmosdb/source/powershell.md`](../references/services/functions/templates/recipes/cosmosdb/source/powershell.md)
- [`references/services/functions/templates/recipes/cosmosdb/source/python.md`](../references/services/functions/templates/recipes/cosmosdb/source/python.md)
- [`references/services/functions/templates/recipes/cosmosdb/source/typescript.md`](../references/services/functions/templates/recipes/cosmosdb/source/typescript.md)
- [`references/services/functions/templates/recipes/cosmosdb/terraform/cosmos.tf.md`](../references/services/functions/templates/recipes/cosmosdb/terraform/cosmos.tf.md)
- [`references/services/functions/templates/recipes/durable/README.md`](../references/services/functions/templates/recipes/durable/README.md)
- [`references/services/functions/templates/recipes/durable/bicep/durable-task-scheduler.bicep.md`](../references/services/functions/templates/recipes/durable/bicep/durable-task-scheduler.bicep.md)
- [`references/services/functions/templates/recipes/durable/eval/python.md`](../references/services/functions/templates/recipes/durable/eval/python.md)
- [`references/services/functions/templates/recipes/durable/eval/summary.md`](../references/services/functions/templates/recipes/durable/eval/summary.md)
- [`references/services/functions/templates/recipes/durable/source/dotnet.md`](../references/services/functions/templates/recipes/durable/source/dotnet.md)
- [`references/services/functions/templates/recipes/durable/source/java.md`](../references/services/functions/templates/recipes/durable/source/java.md)
- [`references/services/functions/templates/recipes/durable/source/javascript.md`](../references/services/functions/templates/recipes/durable/source/javascript.md)
- [`references/services/functions/templates/recipes/durable/source/powershell.md`](../references/services/functions/templates/recipes/durable/source/powershell.md)
- [`references/services/functions/templates/recipes/durable/source/python.md`](../references/services/functions/templates/recipes/durable/source/python.md)
- [`references/services/functions/templates/recipes/durable/source/typescript.md`](../references/services/functions/templates/recipes/durable/source/typescript.md)
- [`references/services/functions/templates/recipes/eventhubs/README.md`](../references/services/functions/templates/recipes/eventhubs/README.md)
- [`references/services/functions/templates/recipes/eventhubs/bicep/eventhubs-network.bicep.md`](../references/services/functions/templates/recipes/eventhubs/bicep/eventhubs-network.bicep.md)
- [`references/services/functions/templates/recipes/eventhubs/bicep/eventhubs.bicep.md`](../references/services/functions/templates/recipes/eventhubs/bicep/eventhubs.bicep.md)
- [`references/services/functions/templates/recipes/eventhubs/eval/python.md`](../references/services/functions/templates/recipes/eventhubs/eval/python.md)
- [`references/services/functions/templates/recipes/eventhubs/eval/summary.md`](../references/services/functions/templates/recipes/eventhubs/eval/summary.md)
- [`references/services/functions/templates/recipes/eventhubs/source/dotnet.md`](../references/services/functions/templates/recipes/eventhubs/source/dotnet.md)
- [`references/services/functions/templates/recipes/eventhubs/source/java.md`](../references/services/functions/templates/recipes/eventhubs/source/java.md)
- [`references/services/functions/templates/recipes/eventhubs/source/javascript.md`](../references/services/functions/templates/recipes/eventhubs/source/javascript.md)
- [`references/services/functions/templates/recipes/eventhubs/source/powershell.md`](../references/services/functions/templates/recipes/eventhubs/source/powershell.md)
- [`references/services/functions/templates/recipes/eventhubs/source/python.md`](../references/services/functions/templates/recipes/eventhubs/source/python.md)
- [`references/services/functions/templates/recipes/eventhubs/source/typescript.md`](../references/services/functions/templates/recipes/eventhubs/source/typescript.md)
- [`references/services/functions/templates/recipes/eventhubs/terraform/eventhubs.tf.md`](../references/services/functions/templates/recipes/eventhubs/terraform/eventhubs.tf.md)
- [`references/services/functions/templates/recipes/mcp/README.md`](../references/services/functions/templates/recipes/mcp/README.md)
- [`references/services/functions/templates/recipes/mcp/eval/python.md`](../references/services/functions/templates/recipes/mcp/eval/python.md)
- [`references/services/functions/templates/recipes/mcp/eval/summary.md`](../references/services/functions/templates/recipes/mcp/eval/summary.md)
- [`references/services/functions/templates/recipes/mcp/source/dotnet.md`](../references/services/functions/templates/recipes/mcp/source/dotnet.md)
- [`references/services/functions/templates/recipes/mcp/source/java.md`](../references/services/functions/templates/recipes/mcp/source/java.md)
- [`references/services/functions/templates/recipes/mcp/source/javascript.md`](../references/services/functions/templates/recipes/mcp/source/javascript.md)
- [`references/services/functions/templates/recipes/mcp/source/powershell.md`](../references/services/functions/templates/recipes/mcp/source/powershell.md)
- [`references/services/functions/templates/recipes/mcp/source/python.md`](../references/services/functions/templates/recipes/mcp/source/python.md)
- [`references/services/functions/templates/recipes/mcp/source/typescript.md`](../references/services/functions/templates/recipes/mcp/source/typescript.md)
- [`references/services/functions/templates/recipes/servicebus/README.md`](../references/services/functions/templates/recipes/servicebus/README.md)
- [`references/services/functions/templates/recipes/servicebus/bicep/servicebus.bicep.md`](../references/services/functions/templates/recipes/servicebus/bicep/servicebus.bicep.md)
- [`references/services/functions/templates/recipes/servicebus/eval/python.md`](../references/services/functions/templates/recipes/servicebus/eval/python.md)
- [`references/services/functions/templates/recipes/servicebus/eval/summary.md`](../references/services/functions/templates/recipes/servicebus/eval/summary.md)
- [`references/services/functions/templates/recipes/servicebus/source/dotnet.md`](../references/services/functions/templates/recipes/servicebus/source/dotnet.md)
- [`references/services/functions/templates/recipes/servicebus/source/java.md`](../references/services/functions/templates/recipes/servicebus/source/java.md)
- [`references/services/functions/templates/recipes/servicebus/source/javascript.md`](../references/services/functions/templates/recipes/servicebus/source/javascript.md)
- [`references/services/functions/templates/recipes/servicebus/source/powershell.md`](../references/services/functions/templates/recipes/servicebus/source/powershell.md)
- [`references/services/functions/templates/recipes/servicebus/source/python.md`](../references/services/functions/templates/recipes/servicebus/source/python.md)
- [`references/services/functions/templates/recipes/servicebus/source/typescript.md`](../references/services/functions/templates/recipes/servicebus/source/typescript.md)
- [`references/services/functions/templates/recipes/servicebus/terraform/servicebus.tf.md`](../references/services/functions/templates/recipes/servicebus/terraform/servicebus.tf.md)
- [`references/services/functions/templates/recipes/sql/README.md`](../references/services/functions/templates/recipes/sql/README.md)
- [`references/services/functions/templates/recipes/sql/bicep/sql.bicep.md`](../references/services/functions/templates/recipes/sql/bicep/sql.bicep.md)
- [`references/services/functions/templates/recipes/sql/eval/python.md`](../references/services/functions/templates/recipes/sql/eval/python.md)
- [`references/services/functions/templates/recipes/sql/eval/summary.md`](../references/services/functions/templates/recipes/sql/eval/summary.md)
- [`references/services/functions/templates/recipes/sql/source/dotnet.md`](../references/services/functions/templates/recipes/sql/source/dotnet.md)
- [`references/services/functions/templates/recipes/sql/source/java.md`](../references/services/functions/templates/recipes/sql/source/java.md)
- [`references/services/functions/templates/recipes/sql/source/javascript.md`](../references/services/functions/templates/recipes/sql/source/javascript.md)
- [`references/services/functions/templates/recipes/sql/source/powershell.md`](../references/services/functions/templates/recipes/sql/source/powershell.md)
- [`references/services/functions/templates/recipes/sql/source/python.md`](../references/services/functions/templates/recipes/sql/source/python.md)
- [`references/services/functions/templates/recipes/sql/source/typescript.md`](../references/services/functions/templates/recipes/sql/source/typescript.md)
- [`references/services/functions/templates/recipes/sql/terraform/sql.tf.md`](../references/services/functions/templates/recipes/sql/terraform/sql.tf.md)
- [`references/services/functions/templates/recipes/timer/README.md`](../references/services/functions/templates/recipes/timer/README.md)
- [`references/services/functions/templates/recipes/timer/eval/python.md`](../references/services/functions/templates/recipes/timer/eval/python.md)
- [`references/services/functions/templates/recipes/timer/eval/summary.md`](../references/services/functions/templates/recipes/timer/eval/summary.md)
- [`references/services/functions/templates/recipes/timer/source/dotnet.md`](../references/services/functions/templates/recipes/timer/source/dotnet.md)
- [`references/services/functions/templates/recipes/timer/source/java.md`](../references/services/functions/templates/recipes/timer/source/java.md)
- [`references/services/functions/templates/recipes/timer/source/javascript.md`](../references/services/functions/templates/recipes/timer/source/javascript.md)
- [`references/services/functions/templates/recipes/timer/source/powershell.md`](../references/services/functions/templates/recipes/timer/source/powershell.md)
- [`references/services/functions/templates/recipes/timer/source/python.md`](../references/services/functions/templates/recipes/timer/source/python.md)
- [`references/services/functions/templates/recipes/timer/source/typescript.md`](../references/services/functions/templates/recipes/timer/source/typescript.md)
- [`references/services/functions/templates/selection.md`](../references/services/functions/templates/selection.md)
- [`references/services/functions/terraform.md`](../references/services/functions/terraform.md)
- [`references/services/functions/triggers.md`](../references/services/functions/triggers.md)

## references/services/key-vault

- [`references/services/key-vault/README.md`](../references/services/key-vault/README.md)
- [`references/services/key-vault/bicep.md`](../references/services/key-vault/bicep.md)
- [`references/services/key-vault/sdk.md`](../references/services/key-vault/sdk.md)

## references/services/logic-apps

- [`references/services/logic-apps/README.md`](../references/services/logic-apps/README.md)
- [`references/services/logic-apps/bicep.md`](../references/services/logic-apps/bicep.md)
- [`references/services/logic-apps/triggers.md`](../references/services/logic-apps/triggers.md)

## references/services/service-bus

- [`references/services/service-bus/README.md`](../references/services/service-bus/README.md)
- [`references/services/service-bus/bicep.md`](../references/services/service-bus/bicep.md)
- [`references/services/service-bus/patterns.md`](../references/services/service-bus/patterns.md)

## references/services/sql-database

- [`references/services/sql-database/README.md`](../references/services/sql-database/README.md)
- [`references/services/sql-database/auth.md`](../references/services/sql-database/auth.md)
- [`references/services/sql-database/bicep.md`](../references/services/sql-database/bicep.md)
- [`references/services/sql-database/sdk.md`](../references/services/sql-database/sdk.md)

## references/services/static-web-apps

- [`references/services/static-web-apps/README.md`](../references/services/static-web-apps/README.md)
- [`references/services/static-web-apps/bicep.md`](../references/services/static-web-apps/bicep.md)
- [`references/services/static-web-apps/deployment.md`](../references/services/static-web-apps/deployment.md)
- [`references/services/static-web-apps/region-availability.md`](../references/services/static-web-apps/region-availability.md)
- [`references/services/static-web-apps/routing.md`](../references/services/static-web-apps/routing.md)

## references/services/storage

- [`references/services/storage/README.md`](../references/services/storage/README.md)
- [`references/services/storage/access.md`](../references/services/storage/access.md)
- [`references/services/storage/bicep.md`](../references/services/storage/bicep.md)
