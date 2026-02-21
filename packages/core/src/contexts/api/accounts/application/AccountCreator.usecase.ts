import { InferDependencies } from "@repo/core/di/autoregister";
import { EventBus } from "@repo/core/shared/domain/EventBus";
import { Account } from "../domain/Account";
import { AccountAlreadyExistsError } from "../domain/AccountAlreadyExist";
import { AccountRepository } from "../domain/AccountRepository";
import { AccountFinder } from "./AccountFinder.usecase";

export type AccountCreatorPayload = {
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
export class AccountCreator {
  constructor(
    private accountRepository: AccountRepository,
    private eventBus: EventBus,
    private accountFinder: AccountFinder,
  ) {}

  async execute(payload: AccountCreatorPayload): Promise<void> {
    await this.ensureAccountDoesNotExist(payload.id);

    const account = Account.create(payload);
    await this.accountRepository.save(account);
    await this.eventBus.publish(account.pullDomainEvents());
  }

  private async ensureAccountDoesNotExist(id: string): Promise<void> {
    const account = await this.accountFinder.execute(id);
    if (account) {
      throw new AccountAlreadyExistsError(id);
    }
  }
}
