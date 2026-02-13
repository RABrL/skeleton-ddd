import type { ContainerBuilder } from "diod";
import type { DomainEvent } from "../../src/shared/domain/domain-event";
import type { DomainEventSubscriber } from "../../src/shared/domain/domain-event-subscriber";
import { EventBus } from "../../src/shared/domain/event-bus";
import { InMemoryAsyncEventBus } from "../../src/shared/infrastructure/event-bus/in-memory/in-memory-async-event-bus";
import { DOMAIN_EVENT_SUBSCRIBER } from "../tags";
import { container } from "../container";

export function register(builder: ContainerBuilder) {
  container.findTaggedServiceIdentifiers<DomainEventSubscriber<DomainEvent>>(DOMAIN_EVENT_SUBSCRIBER).map((identifier) => container.get(identifier));
  builder.register(EventBus).use(InMemoryAsyncEventBus);
}
