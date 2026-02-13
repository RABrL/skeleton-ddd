import type { ContainerBuilder } from "diod";
import { AccountRepository } from "../../../src/contexts/example/accounts/domain/account-repository";
import { DrizzleAccountRepository } from "../../../src/contexts/example/accounts/infrastructure/drizzle-account-repository";

/**
 * Account Repository DI Binding
 *
 * PATTERN DEMONSTRATION:
 * This binds the abstract AccountRepository interface (port) to the
 * concrete DrizzleAccountRepository implementation (adapter).
 *
 * The domain code depends only on the abstract AccountRepository interface,
 * not on the concrete implementation. This allows us to swap implementations
 * (e.g., for testing or different databases) without changing domain code.
 */
export function register(builder: ContainerBuilder) {
  builder.register(AccountRepository).use(DrizzleAccountRepository);
}
