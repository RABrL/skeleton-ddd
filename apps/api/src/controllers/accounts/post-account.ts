import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { CreateAccount } from "@repo/core/contexts/example/accounts/application/create-account.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import { created, domainError, internalServerError } from "~/lib/http-response";

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
  id: z.string().uuid(),
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
      const createAccount = container.get(CreateAccount);

      // PATTERN: Execute with validated payload
      await createAccount.execute({
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

      return internalServerError(c);
    }
  },
);
