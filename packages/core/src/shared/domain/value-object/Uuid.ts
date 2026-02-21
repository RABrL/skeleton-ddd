import { validate as uuidValidate, v7 as uuidv7 } from "uuid";
import { InvalidArgumentError } from "../DomainError";
import { StringValueObject } from "./String";

export class Uuid extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsValidUuid(value);
  }

  static generate(): Uuid {
    return new Uuid(uuidv7());
  }

  private ensureIsValidUuid(value: string): void {
    if (uuidValidate(value)) return;
    throw new InvalidArgumentError("Invalid UUID format");
  }
}
