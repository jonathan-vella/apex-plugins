> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Terraform Patterns

Common patterns for Terraform Azure deployments.

## File Structure

```text
infra/
├── main.tf             # Main resources
├── variables.tf        # Variable definitions
├── outputs.tf          # Output values
├── terraform.tfvars    # Variable values
├── backend.tf          # State backend
└── modules/
    └── ...
```

## Provider Configuration

```hcl
# backend.tf
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    azurecaf = {
      source  = "aztfmod/azurecaf"
      version = "~> 1.2"
    }
  }

  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "tfstate<unique>"
    container_name       = "tfstate"
    key                  = "app.terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}
```

## Variables

```hcl
# variables.tf
variable "environment" {
  type        = string
  description = "Environment name"
}

variable "location" {
  type        = string
  description = "Azure region"
  default     = "eastus2"
}
```

## Main Configuration

```hcl
# main.tf
resource "azurerm_resource_group" "main" {
  name     = "rg-${var.environment}"
  location = var.location
  tags     = { environment = var.environment }
}

module "app" {
  source              = "./modules/app"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  environment         = var.environment
}
```

## Outputs

```hcl
# outputs.tf
output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "app_url" {
  value = module.app.url
}
```

## Naming with Azure CAF

```hcl
resource "azurecaf_name" "storage" {
  name          = var.environment
  resource_type = "azurerm_storage_account"
  random_length = 5
}

resource "azurerm_storage_account" "main" {
  name = azurecaf_name.storage.result
  # ...
}
```

## State Backend Setup

```bash
# Create state storage
# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az group create --name rg-terraform-state --location eastus2

# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az storage account create \
  --name tfstate<unique> \
  --resource-group rg-terraform-state \
  --sku Standard_LRS

# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az storage container create \
  --name tfstate \
  --account-name tfstate<unique>
```

## Security Requirements

| Requirement          | Pattern                              |
| -------------------- | ------------------------------------ |
| No hardcoded secrets | Use Key Vault data sources           |
| Managed Identity     | `identity { type = "UserAssigned" }` |
| State encryption     | Azure Storage encryption             |
| State locking        | Azure Blob lease                     |
