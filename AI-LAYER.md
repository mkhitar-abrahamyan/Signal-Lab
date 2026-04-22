# AI Layer Documentation

This document describes the Cursor AI environment configured for Signal Lab.

## Rules (5 files)

| File | Purpose |
|------|---------|
| `.cursor/rules/stack-constraints.md` | Enforces mandatory libraries and forbidden substitutions |
| `.cursor/rules/observability-conventions.md` | Metric naming, JSON log format, Sentry usage rules |
| `.cursor/rules/prisma-patterns.md` | Safe Prisma usage, migration workflow |
| `.cursor/rules/frontend-patterns.md` | TanStack Query, RHF, shadcn/ui, App Router conventions |
| `.cursor/rules/error-handling.md` | Backend exception filters, frontend toast patterns |

All rules use `alwaysApply: true` so they are loaded into every Cursor session automatically.

## Custom Skills (3 + orchestrator)

| Skill | Location | Purpose |
|-------|----------|---------|
| `add-observability` | `.cursor/skills/add-observability/SKILL.md` | Step-by-step guide to wire metrics, logs, Sentry into any NestJS handler |
| `add-nestjs-endpoint` | `.cursor/skills/add-nestjs-endpoint/SKILL.md` | Scaffold DTO + service + controller + Swagger for a new route |
| `add-scenario-form` | `.cursor/skills/add-scenario-form/SKILL.md` | Create RHF + TanStack Query mutation form with shadcn/ui |
| `signal-lab-orchestrator` | `.cursor/skills/signal-lab-orchestrator/SKILL.md` | Multi-phase PRD executor with context economy |

## Commands (3 files)

| Command | File | Purpose |
|---------|------|---------|
| `/add-endpoint` | `.cursor/commands/add-endpoint.md` | Create endpoint with full observability |
| `/check-obs` | `.cursor/commands/check-obs.md` | Audit a service for missing metrics/logs/Sentry |
| `/run-prd` | `.cursor/commands/run-prd.md` | Execute a PRD through the orchestrator |

## Hooks (2 files)

| Hook | File | Trigger |
|------|------|---------|
| `after-schema-change` | `.cursor/hooks/after-schema-change.md` | After editing `prisma/schema.prisma` — reminds to migrate + generate |
| `after-new-endpoint` | `.cursor/hooks/after-new-endpoint.md` | After adding a route — checks observability wiring |

## Marketplace Skills (6 required)

Stored in `.cursor/marketplace.json`:

| # | Name | Rationale |
|---|------|-----------|
| 1 | **nestjs-best-practices** | Enforces NestJS module structure, DI patterns, and decorator usage that Cursor would otherwise guess incorrectly |
| 2 | **prisma-orm** | Knows Prisma schema syntax, relation definitions, and migration commands — prevents raw SQL and ORM substitution |
| 3 | **shadcn-ui** | Knows exact shadcn component APIs (import paths, prop names) — prevents Cursor from inventing non-existent props |
| 4 | **tailwind-v4-shadcn** | Ensures Tailwind utility class usage is correct for the version in use; prevents class name guessing |
| 5 | **docker-expert** | Handles Dockerfile, Compose networking, volume mounts, and healthcheck syntax correctly |
| 6 | **postgresql-table-design** | Guides index design, constraint naming, and schema decisions when Prisma schema needs optimization |

### What Custom Skills Cover That Marketplace Doesn't
- **`add-observability`** — no marketplace skill teaches Signal Lab's specific metric naming convention (`<domain>_<noun>_total`), JSON log format, and Sentry integration pattern together
- **`add-nestjs-endpoint`** + **`add-scenario-form`** — project-specific scaffolding with the exact patterns, DTOs, and module registration used in this codebase

## Orchestrator

The orchestrator skill (`.cursor/skills/signal-lab-orchestrator/`) contains:

- **SKILL.md**: 7-phase execution flow, context.json schema, resume behavior
- **COORDINATION.md**: Subagent prompts for each phase (analyzer, scanner, planner, decomposer, implementer, reviewer)
- **EXAMPLE.md**: Complete walkthrough of executing PRD 002

### Key Design Decisions
- **Context economy**: 80% of tasks delegated to fast model, only planning/architecture use default
- **`@mkhitar99/context-pruner` integration**: Phase 2 (Codebase Scan) uses context-pruner to generate a token-efficient AST snapshot (~8k tokens vs 30k+ raw). Skeleton mode preserves all signatures while stripping function bodies → `/* logic */`. Config in `pruner.config.json`.
- **Resumability**: All state in `context.json` — interrupted runs continue from last checkpoint
- **Task atomicity**: Each task completable in 5-10 min, with explicit dependencies
- **Review loop**: Max 3 retries per domain before escalating
