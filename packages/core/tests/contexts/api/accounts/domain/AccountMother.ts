import {
  Account,
  type AccountProps,
} from "@repo/core/contexts/api/accounts/domain/Account";
import { AccountEmailMother } from "./AccountEmailMother";
import { AccountIdMother } from "./AccountIdMother";
import { AccountNameMother } from "./AccountNameMother";

export class AccountMother {
  static create(props: AccountProps): Account {
    return Account.create(props);
  }

  static random(): Account {
    return AccountMother.create({
      id: AccountIdMother.random().value,
      name: AccountNameMother.random().value,
      email: AccountEmailMother.random().value,
      createdAt: new Date(),
    });
  }
}
