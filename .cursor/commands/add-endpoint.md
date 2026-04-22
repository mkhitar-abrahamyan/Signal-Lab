# Command: /add-endpoint

Add a new NestJS endpoint with full observability.

## Usage
/add-endpoint <domain> <action> <http-method>

## Steps
1. Use the `add-nestjs-endpoint` skill to scaffold the DTO, service method, and controller route.
2. Use the `add-observability` skill to add metrics, logs, and Sentry integration.
3. Register the new endpoint in the appropriate module.
4. Add Swagger documentation.
5. Verify: `curl -X <METHOD> http://localhost:3001/api/<domain>/<action>` returns expected response.
6. Verify: `curl http://localhost:3001/metrics` shows updated counters.
