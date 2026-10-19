> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Spring Dependency Configuration Patterns

Common dependency and configuration patterns to identify during assessment.

## Database Configuration

**Maven (pom.xml):**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

**application.properties:**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=dbuser
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

**application.yml:**

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://<username>:<password>@server:27017
```

## JMS Message Brokers

**ActiveMQ (pom.xml):**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-activemq</artifactId>
</dependency>
```

**application.properties:**

```properties
spring.activemq.broker-url=tcp://localhost:61616
spring.activemq.user=admin
```

## External Caches

**Redis with Spring Data Redis:**

- Check for `spring-boot-starter-data-redis` dependency
- Review application.properties for Redis connection strings
- Check for Spring Session configuration (in-memory → Redis)

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-cloud-migrate/references/services/container-apps/spring-dependency-patterns.md).
Load only the reference needed for the active task.
