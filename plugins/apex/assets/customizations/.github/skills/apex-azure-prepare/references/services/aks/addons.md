> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# AKS - Add-ons

## Container Monitoring

```bicep
addonProfiles: {
  omsagent: {
    enabled: true
    config: {
      logAnalyticsWorkspaceResourceID: logAnalytics.id
    }
  }
}
```

## Azure CNI Networking

```bicep
networkProfile: {
  networkPlugin: 'azure'
  networkPolicy: 'calico'
}
```

## Azure Key Vault Provider

```bicep
addonProfiles: {
  azureKeyvaultSecretsProvider: {
    enabled: true
    config: {
      enableSecretRotation: 'true'
    }
  }
}
```

## Application Gateway Ingress Controller

```bicep
addonProfiles: {
  ingressApplicationGateway: {
    enabled: true
    config: {
      applicationGatewayId: appGateway.id
    }
  }
}
```

## Add-ons Summary

| Add-on                       | Purpose                                   |
| ---------------------------- | ----------------------------------------- |
| omsagent                     | Container Insights monitoring             |
| azureKeyvaultSecretsProvider | Mount Key Vault secrets as volumes        |
| ingressApplicationGateway    | Application Gateway as ingress controller |
| azurepolicy                  | Azure Policy for Kubernetes               |
