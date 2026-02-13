import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { AccountCreator } from "@repo/core/contexts/example/accounts/application/AccountCreator.usecase";
import { DomainError } from "@repo/core/shared/domain/DomainError";
import { Uuid } from "@repo/core/shared/domain/value-object/Uuid";
import { z } from "zod";
import { factory } from "~/lib/Factory";
import { created, domainError, internalServerError } from "~/lib/HttpResponse";

/**
 * POST /accounts - Create Account Endpoint
 *
 * PATTERN DEMONSTRATION:
 * 1. Zod validation - Type-safe request body validation
 * 2. container.get() - Resolve use case from DI container
 * 3. Error handling - Domain errors vs unexpected errors
 * 4. HTTP response helpers - Consistent API responses
 *
 * This controller shows the complete pattern for creating API endpoints
 * that interact with the domain layer through use cases.
 */

export const postAccountBodySchema = z.object({
  id: z.string().uuid().default(Uuid.generate().value),
  name: z.string().min(1),
  email: z.string().email(),
});

export const postAccountHandlers = factory.createHandlers(
  zValidator("json", postAccountBodySchema),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const user = c.get("user");

      // PATTERN: Resolve use case from container
      const accountCreator = container.get(AccountCreator);

      // PATTERN: Execute with validated payload
      await accountCreator.execute({
        id: body.id,
        name: body.name,
        email: body.email,
      });

      return created(c);
    } catch (error: unknown) {
      // PATTERN: Handle domain errors
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }

      console.error(error);

      return internalServerError(c);
    }
  },
);
