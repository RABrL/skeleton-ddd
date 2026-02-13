import { generateUuid } from "../../utils";

export type DomainEventAttributes = { [key: string]: unknown };

export abstract class DomainEvent {
  static EVENT_NAME: string;

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
    this.eventId = eventId ?? generateUuid();
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