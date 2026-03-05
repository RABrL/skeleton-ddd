import { AccountEmail } from "@repo/core/contexts/api/accounts/domain/AccountEmail";
import { EmailMother } from "../../../../shared/domain/EmailMother";

export class AccountEmailMother {
  static create(value: string): AccountEmail {
    return new AccountEmail(value);
  }

  static random(): AccountEmail {
    return AccountEmailMother.create(EmailMother.random());
  }
}
