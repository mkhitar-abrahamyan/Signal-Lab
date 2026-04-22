# Signal Lab

Observability playground — a full-stack application that generates and visualizes metrics, logs, and errors.

## Prerequisites

- **Docker** & **Docker Compose** v2+
- **Node.js** 20+ (for local development only)
- **Sentry DSN** (optional — set `SENTRY_DSN` env var)

## Quick Start

```bash
# 1. Clone and enter the project
cd Signal-Lab

# 2. Copy environment variables
cp .env.example .env
# Optionally set SENTRY_DSN in .env

# 3. Start everything
docker compose up -d

# 4. Wait for services to be healthy (~30s)
docker compose ps
```

## Service URLs

| Service          | URL                              |
|------------------|----------------------------------|
| **Frontend**     | http://localhost:3000             |
| **Backend API**  | http://localhost:3001/api         |
| **Health Check** | http://localhost:3001/api/health  |
| **Swagger Docs** | http://localhost:3001/api/docs    |
| **Metrics**      | http://localhost:3001/metrics     |
| **Prometheus**   | http://localhost:9090             |
| **Grafana**      | http://localhost:3100 (admin/admin) |

## Verification Walkthrough

1. **Health**: `curl http://localhost:3001/api/health` → `{ "status": "ok" }`
2. **UI**: Open http://localhost:3000 — you should see the Signal Lab dashboard
3. **Run scenarios**: Select each type (success, validation_error, system_error, slow_request, teapot) and click "Run Scenario"
4. **History**: Run history list updates with colored badges
5. **Metrics**: `curl http://localhost:3001/metrics` — look for `scenario_runs_total` and `scenario_run_duration_seconds`
6. **Swagger**: Open http://localhost:3001/api/docs — interactive API documentation
7. **Grafana**: Open http://localhost:3100 → Signal Lab Dashboard shows 4 panels (Runs by Type, Latency p50/p95, Error Rate, Loki Logs)
8. **Loki**: In Grafana Explore, select Loki datasource, query `{app="backend"}` — filterable by `scenarioType`
9. **Sentry**: If SENTRY_DSN is configured, trigger `system_error` — exception appears in Sentry dashboard
10. **Teapot**: Run the "teapot" scenario — HTTP 418 response with `{ signal: 42 }`

## Tech Stack

| Layer        | Technology                                        |
|--------------|---------------------------------------------------|
| Frontend     | Next.js (App Router), shadcn/ui, TailwindCSS, TanStack Query, React Hook Form |
| Backend      | NestJS, TypeScript strict, Swagger, class-validator |
| Database     | PostgreSQL 16 via Prisma ORM                      |
| Metrics      | Prometheus + prom-client                          |
| Logs         | Loki + Promtail (JSON structured)                 |
| Errors       | Sentry                                            |
| Dashboards   | Grafana (provisioned)                             |
| Infra        | Docker Compose                                    |

## Project Structure

```
signal-lab/
├── apps/
│   ├── backend/          # NestJS API
│   │   └── src/
│   │       ├── filters/        # Global exception filter
│   │       ├── health/         # GET /api/health
│   │       ├── metrics/        # Prometheus metrics service + GET /metrics
│   │       ├── prisma/         # Prisma service (global)
│   │       └── scenarios/      # POST /api/scenarios/run, GET /api/scenarios/history
│   └── frontend/         # Next.js App
│       └── src/
│           ├── app/            # Pages and layout
│           ├── components/     # ScenarioForm, RunHistory, ObsLinks
│           └── lib/            # API client, utilities
├── prisma/
│   └── schema.prisma     # ScenarioRun model
├── infra/
│   ├── grafana/          # Provisioned datasources + dashboard
│   ├── loki/             # Loki config
│   ├── prometheus/       # Prometheus scrape config
│   └── promtail/         # Promtail pipeline config
├── .cursor/              # Cursor AI layer
│   ├── rules/            # 5 rule files
│   ├── skills/           # 3 custom skills + orchestrator
│   ├── commands/         # 3 commands
│   └── hooks/            # 2 hooks
├── docker-compose.yml
├── .env.example
└── README.md
```

## Development (without Docker)

```bash
# Backend
cd apps/backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev

# Frontend
cd apps/frontend
npm install
npm run dev
```

## Stop

```bash
docker compose down        # stop containers
docker compose down -v     # stop + remove volumes (resets DB)
```

## Marketplace Skills (Recommended)

See [AI-LAYER.md](./AI-LAYER.md) for the full list of 6+ recommended marketplace skills with rationale.
