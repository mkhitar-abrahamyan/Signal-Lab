# Coordination Prompts

## Analyzer Subagent (Phase 1 — fast)
```
Read the following PRD. Extract a structured list of:
1. Feature requirements (F1, F2, ...)
2. Acceptance criteria (as checklist items)
3. Technical constraints
4. Dependencies between features

Output as JSON matching the context.json phases.analysis.result schema.
```

## Scanner Subagent (Phase 2 — fast)
```
Generate a token-efficient codebase snapshot using @mkhitar99/context-pruner:

1. Run: npx context-pruner prune
   - Uses pruner.config.json at project root (tokenBudget: 8000)
   - Skeleton mode strips function bodies → /* logic */ while preserving signatures
   - Full mode for schemas, configs, API wrappers
   - None mode excludes tests, node_modules, AI layer files

2. Parse CONTEXT.xml output. For each discovered file, note:
   - Module/service/component name
   - Exported function signatures (with parameter types and return types)
   - filepath:line pointers for on-demand retrieval during implementation

3. Fallback (if context-pruner unavailable):
   - List all files in apps/backend/src/ (modules, services, controllers)
   - List all files in apps/frontend/src/ (components, pages, lib)
   - Read Prisma schema models
   - List Docker/infra configuration files

Output as JSON matching the context.json phases.codebase.result schema.
Include the filepath:line index so implementers can read specific code on demand.
```

## Planner Subagent (Phase 3 — default)
```
Given the PRD analysis and codebase scan, create a high-level implementation plan:
1. What already exists and can be reused
2. What needs to be created
3. Integration points between systems
4. Risks and mitigations
5. Suggested implementation order

Output as structured text for context.json phases.planning.result.
```

## Decomposer Subagent (Phase 4 — default)
```
Break the plan into atomic tasks. Each task must:
- Be completable in 5-10 minutes
- Have a 1-3 sentence description
- Be tagged with type, complexity, model, skill
- List explicit dependencies

Rules for model assignment:
- fast: simple CRUD, schema changes, single-file components, config files
- default: architecture decisions, multi-system integration, complex logic

Output as JSON task array for context.json tasks.
```

## Implementer Subagent (Phase 5 — varies)
```
Implement the following task:
Title: {task.title}
Description: {task.description}
Type: {task.type}
Skill: {task.skill}

Use the referenced skill's instructions. After completion, confirm what was created/modified.
```

## Reviewer Subagent (Phase 6 — fast, readonly)
```
Review the {domain} implementation against these acceptance criteria:
{criteria}

Check:
1. All criteria are met
2. Observability is wired (run /check-obs mentally)
3. Code follows project conventions
4. No obvious bugs or missing error handling

Output: PASS or FAIL with specific issues.
```
