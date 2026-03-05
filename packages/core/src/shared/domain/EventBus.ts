import type { DomainEventSubscribers } from "../infrastructure/event-bus/DomainEventSubscribers";
import type { DomainEvent } from "./DomainEvent";

export abstract class EventBus {
  abstract publish(events: Array<DomainEvent>): Promise<void>;
  abstract addSubscribers(subscribers: DomainEventSubscribers): void;
}
