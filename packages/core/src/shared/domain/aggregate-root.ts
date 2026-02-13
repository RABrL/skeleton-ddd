import type { DomainEvent } from "./domain-event";

export abstract class AggregateRoot {
  private domainEvents: Array<DomainEvent> = [];

  pullDomainEvents(): Array<DomainEvent> {
    const domainEvents = this.domainEvents.slice();
    this.domainEvents = [];

    return domainEvents;
  }

  record(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  abstract toPrimitives(): unknown
}
