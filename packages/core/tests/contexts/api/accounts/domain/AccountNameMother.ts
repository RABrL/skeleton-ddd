import { AccountName } from "@repo/core/contexts/api/accounts/domain/AccountName";
import { WordMother } from "../../../../shared/WordMother";

export class AccountNameMother {
  static create(value: string): AccountName {
    return new AccountName(value);
  }

  static random(): AccountName {
    return AccountNameMother.create(
      WordMother.random({ maxLength: 255, minLength: 3 }),
    );
  }
}
