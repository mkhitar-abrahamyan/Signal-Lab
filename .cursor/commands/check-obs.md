# Command: /check-obs

Verify that observability is correctly wired for the current file or service.

## Steps
1. Read the current file.
2. Check for `MetricsService` injection and usage.
3. Check that every public method has at least one `this.logger.log/warn/error` call.
4. Check that JSON.stringify is used for log arguments.
5. Check that `Sentry.captureException` is called for system-level errors.
6. Check that metric labels follow the `type` + `status` convention.
7. Report: list what's present, what's missing, and suggested fixes.
