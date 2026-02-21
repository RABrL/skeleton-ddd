import type { DomainEvent } from "@repo/core/shared/domain/DomainEvent";
import type { DomainEventSubscribers } from "@repo/core/shared/domain/DomainEventSubscriber";
import type { EventBus } from "@repo/core/shared/domain/EventBus";
import { expect, vi } from "vitest";

export default class EventBusMock implements EventBus {
  private publishSpy = vi.fn();

  async publish(events: DomainEvent[]) {
    this.publishSpy(events);
  }

  addSubscribers(subscribers: DomainEventSubscribers): void {}

  assertLastPublishedEventIs(expectedEvent: DomainEvent) {
    const publishSpyCalls = this.publishSpy.mock.calls;

    expect(publishSpyCalls.length).toBeGreaterThan(0);

    const lastPublishSpyCall = publishSpyCalls[publishSpyCalls.length - 1];
    const lastPublishedEvent = lastPublishSpyCall?.[0]?.[0];

    const expected = this.getDataFromDomainEvent(expectedEvent);
    const published = this.getDataFromDomainEvent(lastPublishedEvent);

    expect(expected).toMatchObject(published);
  }

  private getDataFromDomainEvent(event: DomainEvent) {
    const { ...attributes } = event;

    return attributes;
  }
}
