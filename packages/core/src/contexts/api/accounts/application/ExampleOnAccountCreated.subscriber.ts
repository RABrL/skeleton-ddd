import type { DomainEventClass } from "@repo/core/shared/domain/DomainEvent";
import type { DomainEventSubscriber } from "@repo/core/shared/domain/DomainEventSubscriber";
import { AccountCreatedDomainEvent } from "../domain/AccountCreatedDomainEvent";

export class ExampleOnAccountCreated
  implements DomainEventSubscriber<AccountCreatedDomainEvent>
{
  async on(domainEvent: AccountCreatedDomainEvent): Promise<void> {
    console.log("Account created:", domainEvent.toPrimitives());
  }

  subscribedTo(): Array<DomainEventClass> {
    return [AccountCreatedDomainEvent];
  }
}
