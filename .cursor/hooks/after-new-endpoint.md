# Hook: After New Endpoint Created

## Trigger
After creating a new NestJS controller method or route

## Problem Solved
New endpoints commonly lack metrics, structured logging, and Swagger documentation — making them invisible to observability tooling.

## Action
After adding any new route, automatically run `/check-obs` on the new method and remind the developer:

1. Is `MetricsService.incrementRuns()` called? If not, add it.
2. Is `this.logger.log/warn/error(JSON.stringify({...}))` called? If not, add it.
3. Are `@ApiOperation` and `@ApiResponse` Swagger decorators present? If not, add them.
4. Is the route registered in the module's `controllers` array?
5. Does the DTO use `class-validator` decorators?
