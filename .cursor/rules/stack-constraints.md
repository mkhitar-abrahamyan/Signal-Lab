---
name: Stack Constraints
description: Enforces mandatory and forbidden library choices
alwaysApply: true
---

## Allowed Libraries
- State management: Zustand (if needed), React context — NOT Redux, MobX, Jotai
- Server state: TanStack Query — NOT SWR, React Query v3, Apollo
- Forms: React Hook Form — NOT Formik, final-form
- UI components: shadcn/ui — NOT Material UI, Ant Design, Chakra
- HTTP client: fetch or axios — NOT got, ky, superagent
- Backend framework: NestJS — NOT Express, Fastify, Hapi
- ORM: Prisma — NOT TypeORM, Sequelize, raw SQL, Drizzle
- Database: PostgreSQL — NOT MySQL, SQLite, MongoDB

## Never Do
- Add a new UI library without updating this rule
- Use raw SQL queries (always use Prisma)
- Import from 'react-query' (use '@tanstack/react-query')
