---
name: Frontend Patterns
description: Next.js, TanStack Query, RHF, and shadcn/ui conventions
alwaysApply: true
---

## Data Fetching
- Server state: always TanStack Query (`useQuery`, `useMutation`)
- queryKey: descriptive array, e.g. `['scenarios', 'history']`
- Always set `staleTime` and `refetchInterval` appropriately
- Never fetch data directly in useEffect

## Forms
- Always use React Hook Form
- Use `register`, `handleSubmit`, `formState.errors` pattern
- Validate with `zod` + `zodResolver` for complex forms
- Show errors inline under each field

## Components
- Always use shadcn/ui primitives (Button, Card, Badge, Input, Select, Toast)
- Never create custom button/input components when shadcn exists
- Use Tailwind utility classes — no inline styles, no CSS modules

## Routing
- Use Next.js App Router (`app/` directory)
- Server components for static content, client components for interactive
- Mark client components with `'use client'` at top of file
