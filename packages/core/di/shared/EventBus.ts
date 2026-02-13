import type { ContainerBuilder } from "diod";
import type { DomainEvent } from "../../src/shared/domain/DomainEvent";
import type { DomainEventSubscriber } from "../../src/shared/domain/DomainEventSubscriber";
import { EventBus } from "../../src/shared/domain/EventBus";
import { InMemoryAsyncEventBus } from "../../src/shared/infrastructure/event-bus/in-memory/InMemoryAsyncEventBus";
import { DOMAIN_EVENT_SUBSCRIBER } from "../tags";

export function register(builder: ContainerBuilder) {
  builder.register(EventBus).useFactory((container) => {
    /*
     * We automatically get all the subscribers from the container.
     * In order for this to work, they need to use the @DomainEventSubscriber decorator.
     *
     * We use lazy resolution to avoid circular dependencies - subscribers are
     * only resolved when the first event is published, not at EventBus construction time.
     *
     * Example:
     * @DomainEventSubscriber()
     * class UpdateAccountBalanceOnTransactionCreated implements DomainEventSubscriber<TransactionCreatedDomainEvent> {
     *   // ... implementation
     * }
     *
     */

    const subscribers = container
      .findTaggedServiceIdentifiers<DomainEventSubscriber<DomainEvent>>(
        DOMAIN_EVENT_SUBSCRIBER,
      )
      .map((identifier) => container.get(identifier));

    const eventBus = new InMemoryAsyncEventBus();
    eventBus.addSubscribers(subscribers);
    return eventBus;
  });
}
