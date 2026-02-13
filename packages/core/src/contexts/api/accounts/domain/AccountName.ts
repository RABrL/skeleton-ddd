import { StringValueObject } from "../../../shared/domain/value-object/String";
import { AccountNameLengthIncorrect } from "./AccountNameLengthIncorrect";

export class AccountName extends StringValueObject {
  private readonly MIN_LENGTH = 3;
  private readonly MAX_LENGTH = 255;
  constructor(value: string) {
    super(value);
    this.ensureLengthIsBetween(this.MIN_LENGTH, this.MAX_LENGTH);
  }

  private ensureLengthIsBetween(min: number, max: number): void {
    if (this.value.length < min || this.value.length > max) {
      throw new AccountNameLengthIncorrect(
        `Account name must be between ${min} and ${max} characters`,
      );
    }
  }
}
