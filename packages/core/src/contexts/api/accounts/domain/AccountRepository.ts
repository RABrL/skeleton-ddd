import type { Account } from "./Account";
import type { AccountId } from "./AccountId";

export abstract class AccountRepository {
  abstract save(account: Account): Promise<void>;
  abstract findById(id: AccountId): Promise<Account | null>;
}
