import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { AccountCreatedDomainEvent } from "./AccountCreatedDomainEvent";
import { AccountEmail } from "./AccountEmail";
import { AccountId } from "./AccountId";
import { AccountName } from "./AccountName";

export type AccountProps = {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
};

export class Account extends AggregateRoot {
  private constructor(
    public readonly id: AccountId,
    public readonly name: AccountName,
    public readonly email: AccountEmail,
    public readonly createdAt: Date,
  ) {
    super();
  }

  static create({ id, name, email }: AccountProps): Account {
    const account = new Account(
      new AccountId(id),
      new AccountName(name),
      new AccountEmail(email),
      new Date(),
    );

    account.record(
      new AccountCreatedDomainEvent({
        aggregateId: account.id.value,
        name: account.name.value,
        email: account.email.value,
      }),
    );

    return account;
  }

  static fromPrimitives(props: AccountProps): Account {
    return new Account(
      new AccountId(props.id),
      new AccountName(props.name),
      new AccountEmail(props.email),
      new Date(props.createdAt ?? new Date()),
    );
  }

  toPrimitives(): AccountProps {
    return {
      id: this.id.value,
      name: this.name.value,
      email: this.email.value,
      createdAt: this.createdAt,
    };
  }
}
