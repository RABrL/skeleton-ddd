import { AccountRepository } from "@repo/core/contexts/api/accounts/domain/AccountRepository";
import { DrizzleAccountRepository } from "@repo/core/contexts/api/accounts/infrastructure/DrizzleAccountRepository";
import type { ContainerBuilder } from "diod";

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
