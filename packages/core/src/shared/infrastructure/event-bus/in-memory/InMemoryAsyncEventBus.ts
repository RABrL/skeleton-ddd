import { EventEmitter } from "node:events";
import type { DomainEvent } from "../../../domain/DomainEvent";
import type { DomainEventSubscribers } from "../../../domain/DomainEventSubscriber";
import type { EventBus } from "../../../domain/EventBus";

export class InMemoryAsyncEventBus extends EventEmitter implements EventBus {
  async publish(events: DomainEvent[]): Promise<void> {
    events.map((event) => this.emit(event.eventName, event));
  }

  addSubscribers(subscribers: DomainEventSubscribers) {
    subscribers.forEach((subscriber) => {
      subscriber.subscribedTo().forEach((event) => {
        this.on(event.EVENT_NAME, subscriber.on.bind(subscriber));
      });
    });
  }
}
