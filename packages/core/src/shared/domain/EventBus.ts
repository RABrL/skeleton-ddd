import type { DomainEvent } from "./DomainEvent";
import type { DomainEventSubscribers } from "./DomainEventSubscriber";

export abstract class EventBus {
  abstract publish(events: Array<DomainEvent>): Promise<void>;
  abstract addSubscribers(subscribers: DomainEventSubscribers): void;
}
