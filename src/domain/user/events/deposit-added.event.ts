// src/domain/user/events/deposit-added.event.ts
import { DomainEvent, IDomainEvent } from '../../shared/base/event';

export interface IDepositAddedEvent extends IDomainEvent {
    amountInCents: number;
    newTotalDepositInCents?: number;
}

export class DepositAddedEvent extends DomainEvent implements IDepositAddedEvent {
    constructor(
        aggregateId: string,
        public readonly amountInCents: number,
        public readonly newTotalDepositInCents?: number,
        eventVersion: number = 1
    ) {
        super(aggregateId, eventVersion);
        this.amountInCents = amountInCents;
        this.newTotalDepositInCents = newTotalDepositInCents;
    }

    public getEventName(): string {
        return 'DepositAdded';
    }

    public getEventData(): Record<string, any> {
        return {
            ...super.getEventData(),
            amountInCents: this.amountInCents,
            newTotalDepositInCents: this.newTotalDepositInCents,
        };
    }
}
