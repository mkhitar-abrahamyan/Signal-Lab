# Orchestrator Example — Running PRD 002

## Input
```
/run-prd prds/002_prd-observability-demo.md
```

## Phase 1 — Analysis Output
```json
{
  "features": ["F1: UI Scenario Runner", "F2: UI Run History", "F3: Obs Links", "F4: Backend Scenario Execution", "F5: Prometheus Metrics", "F6: Structured Logging", "F7: Sentry", "F8: Grafana Dashboard", "F9: Docker Compose Obs Stack"],
  "criteria": ["4 scenario types work from UI", "Runs saved to PostgreSQL", "GET /metrics returns Prometheus format", "Grafana has 3+ panels", "Logs in Loki filterable by scenarioType", "system_error visible in Sentry"],
  "constraints": ["Must use existing stack", "All scenarios save to ScenarioRun model"]
}
```

## Phase 4 — Task Decomposition (sample)
| ID | Title | Type | Model |
|----|-------|------|-------|
| task-001 | Add ScenarioRun model to Prisma | database | fast |
| task-002 | Create RunScenarioDto | backend | fast |
| task-003 | Implement ScenariosService.run() | backend | default |
| task-004 | Create ScenariosController | backend | fast |
| task-005 | Add MetricsService with prom-client | backend | fast |
| task-006 | Add GET /metrics endpoint | backend | fast |
| task-007 | Add structured JSON logging | backend | fast |
| task-008 | Add Sentry integration | backend | fast |
| task-009 | Create ScenarioForm component | frontend | fast |
| task-010 | Create RunHistory component | frontend | fast |
| task-011 | Create ObsLinks component | frontend | fast |
| task-012 | Add Prometheus to docker-compose | infra | fast |
| task-013 | Add Grafana with provisioned dashboard | infra | default |
| task-014 | Add Loki + Promtail | infra | fast |

## Final Report
```
Signal Lab PRD 002 Execution — Complete

Tasks: 14 completed, 0 failed, 1 retry
Duration: ~25 min
Model usage: 11 fast, 3 default

Completed:
  All 14 tasks

Next steps:
  - Run verification walkthrough
  - Check Grafana dashboard visuals
  - Trigger system_error and verify Sentry capture
```
