import { exampleAccount } from "@repo/db/schema";
import { DrizzlePostgresRepository } from "../../../../shared/infrastructure/persistence/DrizzlePostgresRepository";
import { Account, type AccountProps } from "../domain/Account";
import { AccountRepository } from "../domain/AccountRepository";

/**
 * Drizzle Account Repository Implementation
 *
 * PATTERN DEMONSTRATION:
 * 1. Extends abstract repository port from domain layer
 * 2. Uses Drizzle ORM for database operations
 * 3. Maps between domain entities and database schema
 * 4. Infrastructure detail - not exposed to domain logic
 *
 * This adapter pattern allows the domain to remain independent of
 * database implementation details.
 */
export class DrizzleAccountRepository
  extends DrizzlePostgresRepository<Account>
  implements AccountRepository
{
  protected table = exampleAccount;

  protected toAggregate(row: AccountProps): Account {
    return Account.fromPrimitives(row);
  }

  async save(account: Account): Promise<void> {
    await this.persist(account, exampleAccount.id);
  }

  async findById(id: string): Promise<Account | null> {
    return this.findOne(exampleAccount.id, id);
  }
}
