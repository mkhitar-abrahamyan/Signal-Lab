# Hook: After Prisma Schema Change

## Trigger
After any edit to `prisma/schema.prisma`

## Problem Solved
Developers forget to run migrations and regenerate the Prisma client, leading to type mismatches and runtime errors.

## Action
When you detect changes to `prisma/schema.prisma`, remind the developer:

1. Run: `npx prisma migrate dev --name <descriptive-name>`
2. Run: `npx prisma generate`
3. Check: any service or DTO that uses the modified model may need type updates
4. Check: if adding a new model, add it to the relevant service's `PrismaService` usage

Do not proceed with implementing features that depend on the schema until migration is confirmed.
