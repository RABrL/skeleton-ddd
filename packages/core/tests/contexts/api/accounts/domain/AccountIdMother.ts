import { AccountId } from "@repo/core/contexts/api/accounts/domain/AccountId";
import { UuidMother } from "../../../../shared/UuidMother";

export class AccountIdMother {
  static create(value: string): AccountId {
    return new AccountId(value);
  }

  static random(): AccountId {
    return AccountIdMother.create(UuidMother.random());
  }
}
