# DI Patterns Implementation Notes

## Summary

Successfully ported DI patterns from dok to template, including:
✅ Lazy EventBus subscriber resolution (prevents circular dependencies)
✅ Example use case with @InferDependencies decorator
✅ Example API controller with container.get() pattern
✅ Package exports for context imports
✅ Complete end-to-end example (domain → application → infrastructure → API)

## Critical Finding: Import Type vs Value Imports

### The Problem

When using `import type` for constructor dependencies, Bun's TypeScript transpiler does NOT preserve the class reference in decorator metadata:

```typescript
// ❌ BROKEN - Metadata will be `Object`
import type { AccountRepository } from "../domain/account-repository";

@InferDependencies()
export class CreateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}
}
```

### The Solution

Use regular imports (not `import type`) for classes used as constructor dependencies:

```typescript
// ✅ WORKS - Metadata preserves AccountRepository class reference
import { AccountRepository } from "../domain/account-repository";

@InferDependencies()
export class CreateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}
}
```

### Why This Happens

1. `import type` tells TypeScript the import is only needed for type checking
2. TypeScript/Bun erases type-only imports from the transpiled JavaScript
3. The `@InferDependencies()` decorator relies on `reflect-metadata` which reads actual runtime values
4. If the class isn't imported as a value, metadata records it as `Object`

### Rule for DI with DIOD

**When a class appears as a constructor parameter type AND you're using the @InferDependencies() decorator:**
- Use regular `import { ClassName }` (NOT `import type`)
- Abstract classes work fine - the issue was only with `import type`
- This applies to repositories, services, and any DI'd dependency

**For other type-only usage:**
- Continue using `import type` for types, interfaces, and type aliases
- Example: payload types, primitives types, etc.

## Files Modified

### Core Package

1. **packages/core/src/shared/infrastructure/in-memory-event-bus.ts**
   - Added lazy subscriber resolution
   - Prevents circular dependency issues

2. **packages/core/di/shared/event-bus.ts**
   - Updated to use lazy resolver pattern

3. **packages/core/package.json**
   - Added `"./contexts/*": "./src/contexts/*.ts"` export

### Example Domain Code (New Files)

4. **packages/core/src/contexts/example/accounts/domain/account.ts**
   - Account type definition

5. **packages/core/src/contexts/example/accounts/domain/account-repository.ts**
   - Abstract repository port (interface)

6. **packages/core/src/contexts/example/accounts/application/create-account.usecase.ts**
   - Example use case with @InferDependencies
   - Shows constructor injection pattern

7. **packages/core/src/contexts/example/accounts/infrastructure/drizzle-account-repository.ts**
   - Concrete repository implementation using Drizzle

8. **packages/core/di/contexts/example/account-repository.ts**
   - DI binding (port → adapter)

### Database Schema

9. **packages/db/schema.ts**
   - Added `exampleAccount` table

### API Package

10. **apps/api/src/controllers/accounts/post-account.ts**
    - Example controller with container.get()
    - Zod validation
    - Domain error handling

11. **apps/api/src/routes/accounts.ts**
    - Route definition for accounts resource

12. **apps/api/src/index.ts**
    - Registered accounts route

13. **apps/api/src/lib/http-response.ts**
    - Added `conflict()` helper (optional)

## Verification Status

✅ Core package type-checks successfully
✅ API package imports without errors
✅ Container builds and resolves dependencies
✅ EventBus lazy resolution works correctly
✅ No circular dependency issues

## Pattern Reference

### Use Case Pattern

```typescript
import { InferDependencies } from "../../../../../di/autoregister";
import { SomeRepository } from "../domain/some-repository"; // NOTE: Not "import type"!

@InferDependencies()
export class SomeUseCase {
  constructor(private readonly someRepository: SomeRepository) {}

  async execute(payload: PayloadType): Promise<void> {
    // Implementation
  }
}
```

### Repository Pattern

```typescript
// domain/some-repository.ts
export abstract class SomeRepository {
  abstract save(entity: Entity): Promise<void>;
  abstract findById(id: string): Promise<Entity | null>;
}

// infrastructure/drizzle-some-repository.ts
export class DrizzleSomeRepository extends SomeRepository {
  async save(entity: Entity): Promise<void> {
    // Implementation with Drizzle
  }
}

// di/contexts/some/some-repository.ts
export function register(builder: ContainerBuilder) {
  builder.register(SomeRepository).use(DrizzleSomeRepository);
}
```

### Controller Pattern

```typescript
import { container } from "@repo/core/container";
import { SomeUseCase } from "@repo/core/contexts/some/application/some.usecase";

export const postSomethingHandlers = factory.createHandlers(
  zValidator("json", schema),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const useCase = container.get(SomeUseCase);
      await useCase.execute(body);
      return created(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }
      return internalServerError(c);
    }
  },
);
```

## Next Steps for Users

1. **Remove Example Code (Optional)**
   - Delete `packages/core/src/contexts/example/` if not needed
   - Remove example route from `apps/api/src/index.ts`
   - Remove `exampleAccount` table from `packages/db/schema.ts`

2. **Create Your Domain**
   - Follow the pattern in `contexts/example/accounts/`
   - Remember: Use regular imports (not `import type`) for DI'd classes
   - Use `.usecase.ts` suffix for automatic registration

3. **Create Your API Endpoints**
   - Follow the pattern in `controllers/accounts/` and `routes/accounts.ts`
   - Use `container.get()` to resolve use cases
   - Handle DomainError appropriately

## Benefits Delivered

✅ **Prevents circular dependencies** - Lazy subscriber resolution proven in production
✅ **Clear documentation** - Complete working example shows all patterns
✅ **Type-safe DI** - DIOD with reflect-metadata for automatic dependency resolution
✅ **Production-ready** - Same patterns running in dok since January 2026
✅ **Best practices** - Error handling, validation, HTTP response helpers
