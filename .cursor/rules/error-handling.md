---
name: Error Handling
description: Backend and frontend error handling conventions
alwaysApply: true
---

## Backend
- All unhandled errors go through GlobalExceptionFilter
- Use NestJS built-in exceptions: BadRequestException, NotFoundException, InternalServerErrorException
- System errors (500): always capture to Sentry before throwing
- Never swallow errors silently — log at minimum

## Frontend
- TanStack Query errors: handle in `onError` callback of `useMutation`
- Show user-facing errors via shadcn Toast — never alert()
- Never expose raw error messages from API to users in production
- Log errors to console in development
