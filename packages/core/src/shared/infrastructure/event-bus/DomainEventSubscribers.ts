import type { Container } from "diod";
import { DOMAIN_EVENT_SUBSCRIBER } from "../../../../di/tags";
import { DomainEvent } from "../../domain/DomainEvent";
import { DomainEventSubscriber } from "../../domain/DomainEventSubscriber";

export class DomainEventSubscribers {
  constructor(public items: Array<DomainEventSubscriber<DomainEvent>>) {}

  static from(container: Container): DomainEventSubscribers {
    const subscribers = container
      .findTaggedServiceIdentifiers<DomainEventSubscriber<DomainEvent>>(
        DOMAIN_EVENT_SUBSCRIBER,
      )
      .map((identifier) => container.get(identifier));

    return new DomainEventSubscribers(subscribers);
  }
}
