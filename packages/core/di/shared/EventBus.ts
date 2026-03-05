import type { ContainerBuilder } from "diod";
import { EventBus } from "../../src/shared/domain/EventBus";
import { DomainEventSubscribers } from "../../src/shared/infrastructure/event-bus/DomainEventSubscribers";
import { InMemoryAsyncEventBus } from "../../src/shared/infrastructure/event-bus/in-memory/InMemoryAsyncEventBus";

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

    const subscribers = DomainEventSubscribers.from(container);

    const eventBus = new InMemoryAsyncEventBus();
    eventBus.addSubscribers(subscribers.items);
    return eventBus;
  });
}
