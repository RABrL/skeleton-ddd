import { db } from "@repo/db";
import { eq } from "@repo/db/orm";
import { exampleAccount } from "@repo/db/schema";
import type { Account } from "../domain/account";
import { AccountRepository } from "../domain/account-repository";

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
export class DrizzleAccountRepository extends AccountRepository {
  async save(account: Account): Promise<void> {
    await db
      .insert(exampleAccount)
      .values({
        id: account.id,
        name: account.name,
        email: account.email,
        createdAt: account.createdAt,
      })
      .onConflictDoUpdate({
        target: exampleAccount.id,
        set: {
          name: account.name,
          email: account.email,
        },
      });
  }

  async findById(id: string): Promise<Account | null> {
    const rows = await db
      .select()
      .from(exampleAccount)
      .where(eq(exampleAccount.id, id))
      .limit(1);

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.createdAt,
    };
  }
}
