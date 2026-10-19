> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Container Apps Troubleshooting

### Common Issues Matrix

| Symptom              | Likely Cause                  | Quick Fix                                        |
| -------------------- | ----------------------------- | ------------------------------------------------ |
| Image pull failure   | ACR credentials missing       | `az containerapp registry set --identity system` |
| ACR build fails      | ACR Tasks disabled (free sub) | Build locally with Docker                        |
| Cold start timeout   | min-replicas=0                | `az containerapp update --min-replicas 1`        |
| Port mismatch        | Wrong target port             | Check Dockerfile EXPOSE matches ingress          |
| App keeps restarting | Health probe failing          | Verify `/health` endpoint                        |

### Image Pull Failures

**Diagnose:**

```bash
# Check registry configuration
az containerapp show --name APP -g RG --query "properties.configuration.registries"

# Check revision status
az containerapp revision list --name APP -g RG --output table
```

**Fix:**

```bash
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az containerapp registry set \
  --name APP -g RG \
  --server ACR.azurecr.io \
  --identity system
```

### ACR Tasks Disabled (Free Subscriptions)

**Symptom:** `az acr build` fails with "ACR Tasks is not supported"

**Fix: Build locally instead:**

```bash
docker build -t ACR.azurecr.io/myapp:v1 .
az acr login --name ACR
docker push ACR.azurecr.io/myapp:v1
```

### Cold Start Issues

**Symptom:** First request very slow or times out

**Fix:**

```bash
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az containerapp update --name APP -g RG --min-replicas 1
```

### Health Probe Failures

**Symptom:** Container keeps restarting

**Check:**

```bash
# View health probe config
az containerapp show --name APP -g RG --query "properties.configuration.ingress"

# Check if /health endpoint responds
curl https://APP.REGION.azurecontainerapps.io/health
```

**Fix:** Ensure app has health endpoint returning 200:

```javascript
app.get("/health", (req, res) => res.sendStatus(200));
```

### Port Mismatch

**Symptom:** App starts but returns 502/503

**Check:**

```bash
az containerapp show --name APP -g RG --query "properties.configuration.ingress.targetPort"
```

**Verify:** App must listen on this exact port. Check:

- Dockerfile `EXPOSE` statement
- `process.env.PORT` or hardcoded port in app

### View Logs

```bash
# Stream logs (wait for replicas if scale-to-zero)
az containerapp logs show --name APP -g RG --follow

# Recent logs
az containerapp logs show --name APP -g RG --tail 100

# System logs (startup issues)
az containerapp logs show --name APP -g RG --type system
```

### Get All Diagnostic Info

```bash
# Combined diagnostic command
echo "=== Container App Diagnostics ===" && \
echo "Revisions:" && az containerapp revision list --name APP -g RG -o table && \
echo "Registry Config:" && az containerapp show --name APP -g RG --query "properties.configuration.registries" && \
echo "Ingress Config:" && az containerapp show --name APP -g RG --query "properties.configuration.ingress" && \
echo "Recent Logs:" && az containerapp logs show --name APP -g RG --tail 20
```

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/references/container-apps/README.md).
Load only the reference needed for the active task.
