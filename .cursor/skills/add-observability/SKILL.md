---
name: add-observability
description: Add Prometheus metrics, structured logs, and Sentry integration to a NestJS endpoint
---

# Add Observability Skill

## When to Use
- Adding a new NestJS controller endpoint
- Reviewing an endpoint that lacks metrics/logging
- After any change to scenario execution logic

## Steps

### 1. Inject MetricsService and Logger
```typescript
constructor(
  private readonly metricsService: MetricsService,
  private readonly logger: Logger,
) {}
```

### 2. Add Counter Increment
```typescript
this.metricsService.incrementRuns(type, status);
```
Label conventions: `type` = scenario type, `status` = 'completed' | 'failed' | 'rejected'

### 3. Add Duration Histogram
```typescript
const start = Date.now();
// ... work ...
const duration = Date.now() - start;
this.metricsService.recordDuration(type, duration / 1000);
```

### 4. Add Structured Log
```typescript
this.logger.log(JSON.stringify({
  message: 'descriptive message here',
  level: 'info', // or 'warn' or 'error'
  scenarioType: type,
  scenarioId: id,
  duration,
}));
```

### 5. Sentry (errors only)
```typescript
// For caught exceptions that should be tracked:
Sentry.captureException(error);
// For informational breadcrumbs:
Sentry.addBreadcrumb({ message: 'event description', data: { type } });
```

## Checklist
- [ ] Counter incremented with correct labels
- [ ] Duration recorded in seconds (not ms)
- [ ] Log is valid JSON with all required fields
- [ ] Sentry called for system_error type only
- [ ] Metric names follow `<domain>_<noun>_total` convention
