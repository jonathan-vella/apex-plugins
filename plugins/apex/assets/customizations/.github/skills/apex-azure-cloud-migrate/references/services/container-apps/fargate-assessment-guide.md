> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Assessment: Fargate to Container Apps

## Checklist

### 1. Container Configuration

- **CPU/Memory**: Extract from task definition and verify the requested CPU/memory fits within Azure Container Apps
  limits for the target environment/region
- **Container Images**: Registry location (ECR), image size, base image
- **Port Mappings**: Exposed ports and protocols

### 2. Environment & Secrets

- Static configuration values (env vars)
- Secret references: Secrets Manager ARNs → Key Vault URLs with managed identity
- Parameter Store references → App Configuration or Key Vault
- Service discovery endpoints

### 3. Networking

- VPC subnets (public vs private) → VNet integration
- Security groups → NSG rules
- Load balancer type (ALB/NLB) → Container Apps ingress (built-in HTTPS)
- Health check configuration and SSL/TLS certificates

### 4. IAM & Security

- Task role policies → Managed Identity + Azure RBAC
- ECR pull permissions → ACR role assignment (AcrPull)
- Secrets Manager access → Key Vault RBAC (recommended) or access policies for vaults still using access-policy mode

### 5. Dependencies

- **Databases**: RDS → Azure Database for PostgreSQL/MySQL/SQL
- **Cache**: ElastiCache → Azure Managed Redis
- **Storage**: S3 → Azure Blob Storage (SDK: boto3 → azure-storage-blob)
- **Messaging**: SQS/SNS → Service Bus / Event Grid
- **Monitoring**: CloudWatch → Azure Monitor / Log Analytics (requires Log Analytics workspace on Container Apps environment)

### 6. Scaling & Performance

- Auto scaling policies (target tracking, min/max tasks)
- Request rate and latency requirements
- Actual CPU/memory usage vs allocation

## Resource Mapping

| ECS Task Definition | Container Apps Equivalent |
|---------------------|--------------------------|
| `cpu: "512"` (0.5 vCPU) | `cpu: 0.5` |
| `memory: "1024"` (MB) | `memory: 1Gi` |
| `containerPort` | `ingress.targetPort` |
| `environment` | `env` array |
| `secrets` (Secrets Manager ARN) | `secrets` with `keyVaultUrl` + `identity` |
| `logConfiguration` (awslogs) | Log Analytics (requires workspace on environment) |
| Service Auto Scaling | `scale.rules` (HTTP/CPU/memory/custom) |

## Complexity Rating

- **Low**: Single container, no VPC, standard env vars, public ingress
- **Medium**: Multiple containers, VPC with private connectivity, secrets, custom IAM
- **High**: Multi-service dependencies, VPN/Direct Connect, cross-account IAM, stateful workloads

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-cloud-migrate/references/services/container-apps/fargate-assessment-guide.md).
Load only the reference needed for the active task.
