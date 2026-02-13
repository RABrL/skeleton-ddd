import type { DomainEvent, DomainEventClass } from "./domain-event";

export abstract class DomainEventSubscriber<T extends DomainEvent> {
  abstract on(domainEvent: T): Promise<void>;

  abstract subscribedTo(): Array<DomainEventClass>;
}

export type DomainEventSubscribers = Array<DomainEventSubscriber<DomainEvent>>;