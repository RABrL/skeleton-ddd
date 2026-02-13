import type { Account } from "./account";

export abstract class AccountRepository {
  abstract save(account: Account): Promise<void>;
  abstract findById(id: string): Promise<Account | null>;
}
