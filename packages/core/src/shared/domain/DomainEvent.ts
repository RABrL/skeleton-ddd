import { Uuid } from "./value-object/Uuid";

export type DomainEventAttributes = Record<string, unknown>;

export abstract class DomainEvent {
  static readonly EVENT_NAME: string;

  static fromPrimitives: (params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: DomainEventAttributes;
  }) => DomainEvent;

  readonly eventName: string;
  readonly aggregateId: string;
  readonly eventId: string;
  readonly occurredOn: Date;

  protected constructor(params: {
    eventName: string;
    aggregateId: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    const { eventName, aggregateId, eventId, occurredOn } = params;
    this.eventName = eventName;
    this.aggregateId = aggregateId;
    this.eventId = eventId ?? Uuid.generate().value;
    this.occurredOn = occurredOn ?? new Date();
  }

  abstract toPrimitives(): DomainEventAttributes;
}

export type DomainEventClass = {
  EVENT_NAME: string;
  fromPrimitives: (params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: DomainEventAttributes;
  }) => DomainEvent;
};
