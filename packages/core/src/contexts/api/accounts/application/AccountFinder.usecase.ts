import { InferDependencies } from "@repo/core/di/autoregister";
import type { Account } from "../domain/Account";
import { AccountRepository } from "../domain/AccountRepository";

@InferDependencies()
export class AccountFinder {
  constructor(private accountRepository: AccountRepository) {}

  async execute(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findById(id);
    if (!account) return null;
    return account;
  }
}
