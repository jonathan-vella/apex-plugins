# Health Probes and Observability

## Configuration versus Health

Health-probe configuration enables a routing platform to evaluate an endpoint; configuration alone does not prove
that probes run, pass, exercise dependencies or cause a successful failover. Distinguish:

- Liveness: whether the process should be restarted.
- Readiness/routing: whether this instance should receive traffic.
- Dependency/deep health: whether the required downstream path works.
- User-facing SLI: whether the service actually meets the defined SLO.

Avoid turning transient downstream failure into restart storms with expensive liveness probes.
Apply the parent skill's grants, names-only app settings and evidence rules.

## Global Routing Observations

Read-only examples for an already-granted scope:

```bash
az afd origin-group list --subscription "<subscription>" --profile-name "<profile>" --resource-group "<rg>" \
  --query "[].{name:name,path:healthProbeSettings.probePath,protocol:healthProbeSettings.probeProtocol,interval:healthProbeSettings.probeIntervalInSeconds}" -o json
az graph query --subscriptions "<subscription>" -q "
Resources
| where resourceGroup =~ '<rg>'
| where type =~ 'microsoft.network/trafficmanagerprofiles'
| project id, name, protocol=properties.monitorConfig.protocol,
          port=properties.monitorConfig.port, path=properties.monitorConfig.path,
          profileStatus=properties.profileStatus
" --query "data[]" -o json
```

A null HTTP path is a gap to investigate, not universally proof of no probing: confirm HTTP/HTTPS/TCP probe mode,
provider defaults, enabled state and actual status. A TCP monitor has no HTTP path by design. An origin-group
probe still needs correct route/origin association, host header/SNI, TLS, network access and accepted status evidence.

## App Insights and Monitoring

Do not query connection-string values. Accepted projected settings may establish the telemetry resource mapping;
an inventory may collect **names only** if the granted tool can keep secret values out of its returned output.

```bash
az webapp config appsettings list --subscription "<subscription>" --name "<app>" --resource-group "<rg>" \
  --query "[?contains(name, 'APPINSIGHTS') || contains(name, 'APPLICATIONINSIGHTS')].{name:name}" -o json
az functionapp config appsettings list --subscription "<subscription>" --name "<app>" --resource-group "<rg>" \
  --query "[?contains(name, 'APPINSIGHTS') || contains(name, 'APPLICATIONINSIGHTS')].{name:name}" -o json
```

Setting names suggest configuration, not connectivity, ingestion or alert delivery. Missing samples, sampling,
retention, failed instrumentation and authentication can hide outages. Request accepted telemetry evidence from the
existing task rather than sending test data or changing monitoring configuration.

## Endpoint Design Context

- Keep routing endpoints lightweight and deterministic, returning the probe platform's required success response.
- If probes cannot supply authentication, design a minimal, nonsensitive endpoint with approved network restrictions;
  do not make diagnostic internals publicly anonymous or remove application authentication.
- Separate fast routing health from privileged/optional deep health. Do not expose version details, secrets,
  dependency credentials or personal data.
- Endpoint probes can trigger application work. An HTTP request is not automatically safe: only an already-approved,
  nonmutating endpoint check with bounded timeout is an observation; do not send load or execute a drill.
- App Service health configuration and Functions hosting support differ; consult the service references before
  recommending `healthCheckPath`. Container Apps liveness/readiness is conceptual context, not a supplied assessment.

## Reporting

Return configuration, observed health results/time/window if available, routing relationship, missing coverage and
failure impact. `configured` does not mean healthy; `unverified endpoint` remains unknown.
No health-check installation, code addition, app restart or failover test is performed.

Verify [Front Door probes](https://learn.microsoft.com/azure/frontdoor/health-probes),
[Traffic Manager monitoring](https://learn.microsoft.com/azure/traffic-manager/traffic-manager-monitoring)
and the matching App Service/Functions documentation.
