# DI Patterns Implementation Notes

## Summary

Successfully ported DI patterns from dok to template, including:
- Example use case with @InferDependencies decorator
- Example API controller with container.get() pattern
- Package exports for context imports
- Complete end-to-end example (domain -> application -> infrastructure -> API)
- DrizzlePostgresRepository abstract base class for repository implementations

## File Naming Convention

- **Files**: TitleCase (e.g., `AccountRepository.ts`, `HttpResponse.ts`, `AuthMiddleware.ts`)
- **Folders**: kebab-case (e.g., `value-object/`, `event-bus/`, `in-memory/`)
- **Use case files**: TitleCase with `.usecase.ts` suffix (e.g., `AccountCreator.usecase.ts`)
- **Subscriber files**: TitleCase with `.subscriber.ts` suffix (e.g., `ExampleOnAccountCreated.subscriber.ts`)

## Critical Finding: Import Type vs Value Imports

### The Problem

When using `import type` for constructor dependencies, Bun's TypeScript transpiler does NOT preserve the class reference in decorator metadata:

```typescript
// ❌ BROKEN - Metadata will be `Object`
import type { AccountRepository } from "../domain/AccountRepository";

@InferDependencies()
export class CreateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}
}
```

### The Solution

Use regular imports (not `import type`) for classes used as constructor dependencies:

```typescript
// ✅ WORKS - Metadata preserves AccountRepository class reference
import { AccountRepository } from "../domain/AccountRepository";

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

## DrizzlePostgresRepository Base Class

Located at `packages/core/src/shared/infrastructure/persistence/DrizzlePostgresRepository.ts`.

Provides common database operations for repository implementations using Drizzle + PostgreSQL:

- `persist(aggregate, target)` — Upsert (insert or update on conflict)
- `findOne(column, value)` — Find a single row by column value
- `findMany(column?, value?)` — Find multiple rows with optional filter
- `remove(column, value)` — Delete rows by column value

### Usage

```typescript
import { exampleAccount } from "@repo/db/schema";
import { DrizzlePostgresRepository } from "../../../../shared/infrastructure/persistence/DrizzlePostgresRepository";
import { Account, type AccountProps } from "../domain/Account";
import { AccountRepository } from "../domain/AccountRepository";

export class DrizzleAccountRepository
  extends DrizzlePostgresRepository<Account>
  implements AccountRepository
{
  protected table = exampleAccount;

  protected toAggregate(row: Record<string, unknown>): Account {
    return Account.fromPrimitives(row as AccountProps);
  }

  async save(account: Account): Promise<void> {
    await this.persist(account, exampleAccount.id);
  }

  async findById(id: string): Promise<Account | null> {
    return this.findOne(exampleAccount.id, id);
  }
}
```

### Key Typing Notes

- Uses `PgTable` and `IndexColumn` from `drizzle-orm/pg-core` (not the generic `Table`/`Column`) to satisfy PostgreSQL-specific operations like `onConflictDoUpdate`
- `toAggregate` receives `Record<string, unknown>` — cast to your props type inside the implementation

## Files

### Core Package

1. **packages/core/src/shared/domain/AggregateRoot.ts** — Base class for aggregates with domain event support
2. **packages/core/src/shared/domain/DomainEvent.ts** — Base domain event class
3. **packages/core/src/shared/domain/DomainEventSubscriber.ts** — Abstract subscriber class
4. **packages/core/src/shared/domain/DomainError.ts** — Base error class with `toPrimitives()`
5. **packages/core/src/shared/domain/EventBus.ts** — Abstract event bus port
6. **packages/core/src/shared/domain/Nullable.ts** — Nullable type utility
7. **packages/core/src/shared/domain/Primitives.ts** — Primitives type utility
8. **packages/core/src/shared/domain/value-object/** — Value object base classes (Uuid, String, Int, Enum)
9. **packages/core/src/shared/infrastructure/persistence/DrizzlePostgresRepository.ts** — Abstract Drizzle repository base
10. **packages/core/src/shared/infrastructure/event-bus/in-memory/InMemoryAsyncEventBus.ts** — In-memory async event bus

### Example Domain Code

11. **packages/core/src/contexts/example/accounts/domain/Account.ts** — Account aggregate
12. **packages/core/src/contexts/example/accounts/domain/AccountRepository.ts** — Abstract repository port
13. **packages/core/src/contexts/example/accounts/domain/AccountId.ts** — Account ID value object
14. **packages/core/src/contexts/example/accounts/domain/AccountName.ts** — Account name value object
15. **packages/core/src/contexts/example/accounts/domain/AccountEmail.ts** — Account email value object
16. **packages/core/src/contexts/example/accounts/domain/AccountCreatedDomainEvent.ts** — Domain event
17. **packages/core/src/contexts/example/accounts/domain/AccountAlreadyExist.ts** — Domain error
18. **packages/core/src/contexts/example/accounts/domain/AccountNameLengthIncorrect.ts** — Domain error
19. **packages/core/src/contexts/example/accounts/application/AccountCreator.usecase.ts** — Create account use case
20. **packages/core/src/contexts/example/accounts/application/AccountFinder.usecase.ts** — Find account use case
21. **packages/core/src/contexts/example/accounts/application/ExampleOnAccountCreated.subscriber.ts** — Example subscriber
22. **packages/core/src/contexts/example/accounts/infrastructure/DrizzleAccountRepository.ts** — Drizzle repository adapter

### DI Configuration

23. **packages/core/di/container.ts** — Container builder
24. **packages/core/di/autoregister.ts** — Auto-discovery and registration
25. **packages/core/di/contexts/example/accountRepository.ts** — Account repo DI binding
26. **packages/core/di/shared/eventBus.ts** — EventBus DI binding with lazy subscriber resolution

### Database

27. **packages/db/schema.ts** — Drizzle schema with `exampleAccount` table
28. **packages/db/index.ts** — DB connection

### API Package

29. **apps/api/src/index.ts** — Hono app entry point
30. **apps/api/src/routes/Accounts.ts** — Account routes
31. **apps/api/src/controllers/accounts/PostAccount.ts** — POST /accounts controller
32. **apps/api/src/lib/HttpResponse.ts** — HTTP response helpers
33. **apps/api/src/lib/Factory.ts** — Hono factory with protected variables
34. **apps/api/src/middlewares/AuthMiddleware.ts** — Auth middleware
35. **apps/api/src/middlewares/CorsMiddleware.ts** — CORS middleware
36. **apps/api/src/types/App.ts** — App variable types

## Pattern Reference

### Use Case Pattern

```typescript
import { InferDependencies } from "../../../../../di/autoregister";
import { SomeRepository } from "../domain/SomeRepository"; // NOTE: Not "import type"!

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
// domain/SomeRepository.ts
export abstract class SomeRepository {
  abstract save(aggregate: Aggregate): Promise<void>;
  abstract findById(id: string): Promise<Aggregate | null>;
}

// infrastructure/DrizzleSomeRepository.ts
export class DrizzleSomeRepository
  extends DrizzlePostgresRepository<Aggregate>
  implements SomeRepository
{
  protected table = someTable;

  protected toAggregate(row: Record<string, unknown>): Aggregate {
    return Aggregate.fromPrimitives(row as AggregateProps);
  }

  async save(aggregate: Aggregate): Promise<void> {
    await this.persist(aggregate, someTable.id);
  }

  async findById(id: string): Promise<Aggregate | null> {
    return this.findOne(someTable.id, id);
  }
}

// di/contexts/some/SomeRepository.ts
export function register(builder: ContainerBuilder) {
  builder.register(SomeRepository).use(DrizzleSomeRepository);
}
```

### Controller Pattern

```typescript
import { container } from "@repo/core/container";
import { SomeUseCase } from "@repo/core/contexts/some/application/SomeUseCase.usecase";

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
