import { db } from "@repo/db";
import { eq } from "@repo/db/orm";
import type { IndexColumn, PgTable } from "drizzle-orm/pg-core";
import type { AggregateRoot } from "../../domain/AggregateRoot";

export abstract class DrizzlePostgresRepository<T extends AggregateRoot> {
  protected readonly db = db;

  protected abstract table: PgTable;

  protected abstract toAggregate(row: Record<string, unknown>): T;

  protected async persist(
    aggregate: T,
    target: IndexColumn | IndexColumn[],
  ): Promise<void> {
    await this.db
      .insert(this.table)
      .values(aggregate.toPrimitives())
      .onConflictDoUpdate({
        target,
        set: aggregate.toPrimitives(),
      });
  }

  protected async findOne(
    column: IndexColumn,
    value: unknown,
  ): Promise<T | null> {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(eq(column, value))
      .limit(1);

    if (rows.length === 0) return null;
    return this.toAggregate(rows[0] as Record<string, unknown>);
  }

  protected async findMany(
    column?: IndexColumn,
    value?: unknown,
  ): Promise<T[]> {
    const query = this.db.select().from(this.table);

    if (column && value !== undefined) {
      query.where(eq(column, value));
    }

    const rows = await query;
    return rows.map((row) => this.toAggregate(row as Record<string, unknown>));
  }

  protected async remove(column: IndexColumn, value: unknown): Promise<void> {
    await this.db.delete(this.table).where(eq(column, value));
  }
}
