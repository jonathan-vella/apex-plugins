> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Azure CLI Commands

Common az commands for deployment workflows.

## Resource Group

```bash
# Create
# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az group create --name <rg-name> --location <location>

# Delete
# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az group delete --name <rg-name> --yes --no-wait
```

## Container Registry

```bash
# Create
# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az acr create --name <acr-name> --resource-group <rg-name> --sku Basic

# Login
az acr login --name <acr-name>

# Build and push
az acr build --registry <acr-name> --image <image:tag> .
```

## Container Apps

```bash
# Create environment
# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az containerapp env create \
  --name <env-name> \
  --resource-group <rg-name> \
  --location <location>

# Deploy app
# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az containerapp create \
  --name <app-name> \
  --resource-group <rg-name> \
  --environment <env-name> \
  --image <acr-name>.azurecr.io/<image:tag> \
  --target-port 8080 \
  --ingress external
```

## App Service

```bash
# Create plan
# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az appservice plan create \
  --name <plan-name> \
  --resource-group <rg-name> \
  --sku B1 --is-linux

# Create web app
# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az webapp create \
  --name <app-name> \
  --resource-group <rg-name> \
  --plan <plan-name> \
  --runtime "NODE:22-lts"
```

## Functions

```bash
# Create function app
# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az functionapp create \
  --name <func-name> \
  --resource-group <rg-name> \
  --storage-account <storage-name> \
  --consumption-plan-location <location> \
  --runtime node \
  --functions-version 4
```

## Key Vault

```bash
# Create
# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az keyvault create \
  --name <kv-name> \
  --resource-group <rg-name> \
  --location <location>

# Set secret
# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az keyvault secret set \
  --vault-name <kv-name> \
  --name <secret-name> \
  --value <secret-value>
```
