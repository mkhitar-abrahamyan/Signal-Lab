# Signal Lab — Submission Checklist

Заполни этот файл перед сдачей. Он поможет интервьюеру быстро проверить решение.

---

## Репозиторий

- **URL**: `https://github.com/mkhitar-abrahamyan/Signal-Lab`
- **Ветка**: `main`
- **Время работы** (приблизительно): `4:30` часов

---

## Запуск

```bash
# Команда запуска:
docker compose up -d

# Команда проверки:
curl http://localhost:3001/api/health

# Команда остановки:
docker compose down
docker compose down -v  # с удалением данных
```

**Предусловия**: Docker >= 24, Docker Compose >= 2.20, Node >= 20 (только для локальных Prisma команд)

---

## Стек — подтверждение использования

| Технология | Используется? | Где посмотреть |
|-----------|:------------:|----------------|
| Next.js (App Router) | ☑ | `apps/frontend/src/app/page.tsx`, `layout.tsx` |
| shadcn/ui | ☑ | `apps/frontend/src/components/ScenarioForm.tsx` — Button, Select, Input, Card, Badge |
| Tailwind CSS | ☑ | `apps/frontend/src/app/globals.css`, все компоненты используют utility-классы |
| TanStack Query | ☑ | `ScenarioForm.tsx` (useMutation), `RunHistory.tsx` (useQuery), `providers.tsx` (QueryClientProvider) |
| React Hook Form | ☑ | `ScenarioForm.tsx` — useForm, handleSubmit, setValue |
| NestJS | ☑ | `apps/backend/src/main.ts`, все модули в `src/` |
| PostgreSQL | ☑ | `docker-compose.yml` — postgres:16-alpine |
| Prisma | ☑ | `apps/backend/prisma/schema.prisma`, `src/prisma/prisma.service.ts` |
| Sentry | ☑ | `main.ts` (Sentry.init), `scenarios.service.ts` (captureException, addBreadcrumb) |
| Prometheus | ☑ | `src/metrics/metrics.service.ts`, `GET /metrics`, `infra/prometheus/prometheus.yml` |
| Grafana | ☑ | `infra/grafana/provisioning/` — datasources + dashboard с 4 панелями |
| Loki | ☑ | `infra/loki/loki-config.yaml`, `infra/promtail/promtail-config.yaml` |

---

## Observability Verification

Опиши, как интервьюер может проверить каждый сигнал:

| Сигнал | Как воспроизвести | Где посмотреть результат |
|--------|-------------------|------------------------|
| Prometheus metric | Запустить любой сценарий из UI | `http://localhost:3001/metrics` — `scenario_runs_total`, `scenario_run_duration_seconds` |
| Grafana dashboard | Запустить несколько сценариев | `http://localhost:3100` → Signal Lab Dashboard (4 панели) |
| Loki log | Запустить сценарий | Grafana → Explore → Loki → `{app="backend"}` — фильтрация по `scenarioType` |
| Sentry exception | Запустить "system_error" сценарий | Sentry dashboard (требуется SENTRY_DSN в .env) |

---

## Cursor AI Layer

### Custom Skills

| # | Skill name | Назначение |
|---|-----------|-----------|
| 1 | `add-observability` | Пошаговая инструкция для добавления метрик, логов, Sentry к NestJS endpoint |
| 2 | `add-nestjs-endpoint` | Scaffold нового endpoint: DTO + service + controller + Swagger + module |
| 3 | `add-scenario-form` | Создание RHF-формы с TanStack Query mutation и shadcn/ui |

### Commands

| # | Command | Что делает |
|---|---------|-----------|
| 1 | `/add-endpoint` | Создаёт endpoint с observability, Swagger и регистрацией в модуле |
| 2 | `/check-obs` | Аудит файла: проверяет наличие метрик, логов, Sentry, формат JSON-логов |
| 3 | `/run-prd` | Запускает PRD через orchestrator с фазами и context.json |

### Hooks

| # | Hook | Какую проблему решает |
|---|------|----------------------|
| 1 | `after-schema-change` | Напоминает запустить migrate + generate после изменений Prisma schema |
| 2 | `after-new-endpoint` | Проверяет наличие метрик, логов, Swagger, module registration на новом route |

### Rules

| # | Rule file | Что фиксирует |
|---|----------|---------------|
| 1 | `stack-constraints.md` | Разрешённые/запрещённые библиотеки (TanStack а не SWR, Prisma а не TypeORM...) |
| 2 | `observability-conventions.md` | Naming метрик, JSON-формат логов, правила Sentry |
| 3 | `prisma-patterns.md` | Workflow миграций, запрет raw SQL, inject через service |
| 4 | `frontend-patterns.md` | TanStack Query для server state, RHF для форм, shadcn для UI |
| 5 | `error-handling.md` | GlobalExceptionFilter, toast для ошибок, Sentry для system errors |

### Marketplace Skills

| # | Skill | Зачем подключён |
|---|-------|----------------|
| 1 | `nestjs-best-practices` | Структура модулей NestJS, DI-паттерны, декораторы |
| 2 | `prisma-orm` | Синтаксис schema, relation, migration commands |
| 3 | `shadcn-ui` | API компонентов, import paths, prop names |
| 4 | `tailwind-v4-shadcn` | Корректные utility-классы для текущей версии Tailwind |
| 5 | `docker-expert` | Dockerfile, Compose networking, volume mounts, healthchecks |
| 6 | `postgresql-table-design` | Индексы, constraints, schema-оптимизация через Prisma |

**Что закрыли custom skills, чего нет в marketplace:**
- `add-observability` — ни один marketplace skill не учит конкретную конвенцию Signal Lab: naming `<domain>_<noun>_total`, JSON-формат логов, интеграцию Sentry по сценарию (captureException vs addBreadcrumb).
- `add-nestjs-endpoint` + `add-scenario-form` — project-specific scaffolding с точными паттернами, DTO и module registration этого кодбейса.

---

## Orchestrator

- **Путь к skill**: `.cursor/skills/signal-lab-orchestrator/SKILL.md`
- **Путь к context file** (пример): `.execution/<timestamp>/context.json`
- **Сколько фаз**: 7 (analysis → codebase → planning → decomposition → implementation → review → report)
- **Какие задачи для fast model**: Добавить поле в Prisma, создать DTO, добавить метрику/лог, создать простой UI-компонент, написать конфиг promtail (80%+ задач)
- **Поддерживает resume**: да — читает context.json, пропускает completed фазы, продолжает с currentPhase

---

## Скриншоты / видео

- [ ] UI приложения - https://prnt.sc/9YnaePcsB1km
- [ ] Grafana dashboard с данными - https://prnt.sc/GUX_DEU9R-Es
- [ ] Prometheus - https://prnt.sc/f6bfIq1uyYsE
- [ ] Metrics - https://prnt.sc/nEep7uVB-cIa
- [ ] Swagger - https://prnt.sc/nEep7uVB-cIa
- [ ] Loki logs - https://prnt.sc/74tCzIDKPX4Y
- [ ] Sentry error - Didn't check

(Приложи файлы или ссылки ниже)

---

## Что не успел и что сделал бы первым при +4 часах

- Полный e2e тест verification walkthrough в Docker
- Более детальные Swagger response types (@ApiOkResponse с DTO-типами)
- Integration tests для scenario service
- Grafana alerting rules для error rate threshold
- Sentry test

---

## Вопросы для защиты (подготовься)

1. Почему именно такая декомпозиция skills?
2. Какие задачи подходят для малой модели и почему?
3. Какие marketplace skills подключил, а какие заменил custom — и почему?
4. Какие hooks реально снижают ошибки в повседневной работе?
5. Как orchestrator экономит контекст по сравнению с одним большим промптом?
