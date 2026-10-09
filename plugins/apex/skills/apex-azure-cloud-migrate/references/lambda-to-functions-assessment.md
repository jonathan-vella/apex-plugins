# Lambda To Functions Assessment

Use this reference to assess a proposed AWS Lambda to Azure Functions migration from accepted evidence. It is not a
source-discovery or code-conversion procedure.

## Mapping Checklist

| AWS concern | Azure assessment focus |
| --- | --- |
| Lambda handler and event | Functions trigger, invocation model, retry, and idempotency intent |
| API Gateway | HTTP trigger, authentication boundary, and gateway requirement |
| S3 events | Blob and Event Grid delivery semantics, ordering, and poison handling |
| SQS or SNS | Queue, Service Bus, or Event Grid delivery guarantees and dead-letter ownership |
| DynamoDB streams | Cosmos DB change-feed fit, data model, and consistency assumptions |
| CloudWatch | Application Insights and Azure Monitor evidence requirements |
| IAM role | Managed identity and least-privilege Azure RBAC intent |

## Runtime And Data Review

- Identify the source runtime, dependency model, handler contract, bindings, environment configuration, and test scope.
- Separate portable business logic from event adapters, SDK usage, and source-cloud service assumptions.
- Record data residency, transfer, retention, recovery, cutover, rollback, and ownership constraints before any
  transformation is considered.
- Treat target runtime support, service limits, and provider behavior as evidence that must be current and accepted.

## Blocked Operations

Source-cloud reads, repository scans, code transformation, local execution, publishing, data transfer, and cutover are
not authorized by this assessment. Return an unavailable or needs-input blocker when the task needs any of them.
