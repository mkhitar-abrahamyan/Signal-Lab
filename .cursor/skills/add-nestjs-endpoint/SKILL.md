---
name: add-nestjs-endpoint
description: Scaffold a new NestJS endpoint following Signal Lab patterns
---

# Add NestJS Endpoint Skill

## When to Use
- Adding any new route to the backend
- Creating a new NestJS module

## Template

### 1. Create DTO
```typescript
// src/<domain>/dto/<action>-<domain>.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateXDto {
  @IsString()
  requiredField: string;

  @IsOptional()
  @IsString()
  optionalField?: string;
}
```

### 2. Create Service Method
```typescript
async doAction(dto: CreateXDto) {
  // 1. validate business rules
  // 2. persist with Prisma
  // 3. emit metrics
  // 4. log
  // 5. return result
}
```

### 3. Create Controller Route
```typescript
@Post('action')
@HttpCode(200)
async action(@Body() dto: CreateXDto) {
  return this.service.doAction(dto);
}
```

### 4. Register in Module
Add service + controller to the module's `providers` and `controllers` arrays.

### 5. Add Swagger Decorators
```typescript
@ApiOperation({ summary: 'Short description' })
@ApiResponse({ status: 200, description: 'Success' })
```

## Checklist
- [ ] DTO uses class-validator decorators
- [ ] Service injected via constructor (not new)
- [ ] Route registered in module
- [ ] Swagger decorators present
- [ ] Observability added (see add-observability skill)
