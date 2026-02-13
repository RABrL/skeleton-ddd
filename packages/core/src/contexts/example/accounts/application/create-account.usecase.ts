import { InferDependencies } from "../../../../../di/autoregister";
import { AccountRepository } from "../domain/account-repository";

export type CreateAccountPayload = {
  id: string;
  name: string;
  email: string;
};

/**
 * Create Account Use Case
 *
 * PATTERN DEMONSTRATION:
 * 1. @InferDependencies() - Enables DIOD to extract constructor parameter types
 * 2. Constructor injection - Dependencies injected via constructor
 * 3. execute() method - Standard use case pattern
 * 4. File naming - .usecase.ts suffix triggers auto-registration
 *
 * The @InferDependencies() decorator is required for the DI container to
 * understand what dependencies to inject. Without it, TypeScript type metadata
 * would be lost at runtime.
 */
@InferDependencies()
export class CreateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(payload: CreateAccountPayload): Promise<void> {
    // Example implementation - validates and creates account
    const account = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      createdAt: new Date(),
    };

    await this.accountRepository.save(account);
  }
}
