---
name: Prisma Patterns
description: How to work with Prisma safely
alwaysApply: true
---

## Rules
- Always use Prisma Client — never `prisma.$queryRaw` or `prisma.$executeRaw`
- Never import PrismaClient directly in controllers — inject through service
- Always run `npx prisma migrate dev` after schema changes
- Always run `npx prisma generate` after schema changes before building
- Never store sensitive data unencrypted in Json fields

## Migration Workflow
1. Edit `prisma/schema.prisma`
2. `npx prisma migrate dev --name <descriptive-name>`
3. `npx prisma generate`
4. Update affected DTOs and service types
