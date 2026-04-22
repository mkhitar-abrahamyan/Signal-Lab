---
name: Observability Conventions
description: Metric naming, log format, and Sentry rules
alwaysApply: true
---

## Metric Naming
- Counters: `<domain>_<noun>_total` (e.g. `scenario_runs_total`)
- Histograms: `<domain>_<noun>_seconds` (e.g. `scenario_run_duration_seconds`)
- Gauges: `<domain>_<noun>_active` (e.g. `http_connections_active`)
- Labels: snake_case, always include `type` and `status` for run metrics

## Log Format
Every log must be valid JSON with these fields:
```json
{ "message": "string", "level": "info|warn|error", "scenarioType": "string", "scenarioId": "string", "duration": 0 }
```
- Use `this.logger.log/warn/error(JSON.stringify({...}))` — never plain strings
- Always include `scenarioType` when inside a scenario handler

## Sentry Rules
- `system_error` scenario: ALWAYS `Sentry.captureException(new Error(...))`
- `validation_error`: ALWAYS `Sentry.addBreadcrumb(...)`
- Never call `Sentry.captureException` for expected business errors
- DSN must come from `process.env.SENTRY_DSN` — never hardcode
