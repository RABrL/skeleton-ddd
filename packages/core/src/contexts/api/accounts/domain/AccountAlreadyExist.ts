import { InvalidArgumentError } from "../../../shared/domain/DomainError";

export class AccountAlreadyExistsError extends InvalidArgumentError {
  constructor(id: string) {
    super(`Account with id ${id} already exist`);
  }
}
