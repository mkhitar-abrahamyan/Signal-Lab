---
name: signal-lab-orchestrator
description: Multi-phase PRD executor for Signal Lab. Decomposes PRDs into atomic tasks, delegates to subagents, tracks state in context.json, and supports resume.
---

# Signal Lab Orchestrator

## When to Use
- Implementing a new PRD from scratch
- Resuming interrupted PRD execution
- Running /run-prd command

## Overview

The orchestrator splits PRD execution into 7 phases. It stores all state in `.execution/<timestamp>/context.json`. On re-run, it reads existing context and skips completed phases.

80% of tasks use fast model. Only planning, architecture decisions, and complex integration use default model.

## Phase Sequence

### Phase 1 — PRD Analysis (fast)
Read the PRD. Extract:
- Features list (F1, F2, ... Fn)
- Acceptance criteria
- Constraints
- Dependencies between features
Write results to `context.json > phases.analysis.result`.

### Phase 2 — Codebase Scan (fast)
Explore project structure using `@mkhitar99/context-pruner`:

1. Run `npx context-pruner prune` to generate a token-efficient AST snapshot (`CONTEXT.xml`).
   - Configuration in `pruner.config.json` at project root.
   - `tokenBudget: 8000` keeps output small enough for fast models.
   - `depthMap` controls per-directory detail:
     - `full` — Prisma schema, API wrappers, infra configs (need exact content).
     - `skeleton` — Backend services, controllers, frontend components (signatures only, bodies replaced with `/* logic */`).
     - `none` — Tests, node_modules, AI layer files (excluded).
2. Parse `CONTEXT.xml` output. For each file note:
   - Existing modules, services, components
   - Exported types and function signatures
   - `filepath:line` pointers for on-demand retrieval during Phase 5
3. If `context-pruner` is unavailable, fall back to manual listing:
   - List files in `apps/backend/src/`, `apps/frontend/`, `prisma/`
   - Note existing modules, services, components

Write to `context.json > phases.codebase.result`.

**Why context-pruner**: A full codebase dump can consume 30k+ tokens. The pruner strips function bodies while preserving all signatures, types, and semantic pointers — reducing to ~8k tokens. This allows the fast model to understand the entire project structure in a single prompt, directly supporting the 80% fast-model target.

### Phase 3 — Planning (default)
Based on analysis + codebase scan:
- Identify what exists vs what needs to be built
- Identify integration points
- Flag risks
Write to `context.json > phases.planning.result`.

### Phase 4 — Decomposition (default)
Break the plan into atomic tasks. Each task:
- Completable in 5-10 minutes
- Described in 1-3 sentences
- Tagged: `type` (database/backend/frontend/infra), `complexity` (low/medium/high), `model` (fast/default)
- Has explicit dependencies (`dependsOn: ["task-001"]`)
Write full task list to `context.json > tasks`.

**Fast model tasks (examples):**
- Add field to Prisma schema
- Create DTO with validation
- Add metric increment call
- Create simple UI component
- Write a Promtail config

**Default model tasks (examples):**
- Design service architecture with multiple integrations
- Implement retry/error recovery logic
- Complex state management between components

### Phase 5 — Implementation (fast 80% / default 20%)
For each task in dependency order:
1. Read `context.json` to get task details
2. Identify which skill to use (`add-nestjs-endpoint`, `add-observability`, `add-scenario-form`, etc.)
3. Implement the task
4. Mark `status: completed` in `context.json`
5. Move to next task

On failure: mark `status: failed`, note error, continue.

### Phase 6 — Review (fast, readonly)
For each domain (database, backend, frontend):
1. Check implementation against acceptance criteria
2. Run `/check-obs` on backend services
3. If issues found: create fix tasks, run implementer
4. Max 3 retry loops per domain

### Phase 7 — Report (fast)
Generate final report:
```
Signal Lab PRD Execution — Complete

Tasks: X completed, Y failed, Z retries
Duration: ~N min
Model usage: A fast, B default

Completed: [list]
Failed: [list with reasons]
Next steps: [list]
```

## Resume Behavior
If execution is interrupted, re-run the orchestrator with the same PRD path.
It will:
1. Find existing `.execution/` directory
2. Load `context.json`
3. Skip phases with `status: completed`
4. Continue from `currentPhase`

## Context File Schema
```json
{
  "executionId": "YYYY-MM-DD-HH-mm",
  "prdPath": "path/to/prd.md",
  "status": "in_progress | completed | failed",
  "currentPhase": "analysis | codebase | planning | decomposition | implementation | review | report",
  "phases": {
    "analysis": { "status": "pending | in_progress | completed | failed", "result": "..." },
    "codebase": { "status": "...", "result": "..." },
    "planning": { "status": "...", "result": "..." },
    "decomposition": { "status": "...", "result": "..." },
    "implementation": { "status": "...", "completedTasks": 0, "totalTasks": 0 },
    "review": { "status": "...", "result": "..." },
    "report": { "status": "...", "result": "..." }
  },
  "signal": 42,
  "tasks": [
    {
      "id": "task-001",
      "title": "Short task title",
      "description": "1-3 sentence description of what to do",
      "type": "database | backend | frontend | infra",
      "complexity": "low | medium | high",
      "model": "fast | default",
      "skill": "add-nestjs-endpoint | add-observability | add-scenario-form | none",
      "dependsOn": [],
      "status": "pending | in_progress | completed | failed",
      "error": null
    }
  ]
}
```
