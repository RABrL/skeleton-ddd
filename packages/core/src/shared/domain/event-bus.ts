import type { DomainEvent } from "./domain-event";
import type { DomainEventSubscribers } from "./domain-event-subscriber";

export abstract class EventBus {
  abstract publish(events: Array<DomainEvent>): Promise<void>;
  abstract addSubscribers(subscribers: DomainEventSubscribers): void;
}
