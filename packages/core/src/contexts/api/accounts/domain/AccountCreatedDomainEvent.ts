import {
  DomainEvent,
  type DomainEventAttributes,
} from "../../../shared/domain/DomainEvent";

export class AccountCreatedDomainEvent extends DomainEvent {
  static override readonly EVENT_NAME = "account.created";

  readonly name: string;
  readonly email: string;

  constructor({
    aggregateId,
    name,
    email,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    email: string;
    name: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({
      eventName: AccountCreatedDomainEvent.EVENT_NAME,
      aggregateId,
      eventId,
      occurredOn,
    });
    this.email = email;
    this.name = name;
  }

  toPrimitives() {
    const { name, email } = this;
    return {
      name,
      email,
    };
  }

  static override fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: DomainEventAttributes;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new AccountCreatedDomainEvent({
      aggregateId,
      eventId,
      occurredOn,
      name: attributes.name as string,
      email: attributes.email as string,
    });
  }
}
