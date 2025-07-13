// src/domain/user/events/user-created.event.ts
import { DomainEvent, IDomainEvent } from '../../shared/base/event';
import { Money } from '../../shared/value-objects/money.vo';
import { UserId } from '../../user/value-objects/user-id.vo';


export interface IProductCreatedEvent extends IDomainEvent {
    name: string;
    cost: Money;
    amountAvailable: number;
    sellerId: UserId;
}

export class ProductCreatedEvent extends DomainEvent implements IProductCreatedEvent {
    public readonly name: string;
    public readonly cost: Money;
    public readonly amountAvailable: number;
    public readonly sellerId: UserId;

    constructor(
        aggregateId: string,
        name: string,
        cost: Money,
        amountAvailable: number,
        sellerId: UserId,
        eventVersion: number = 1
    ) {
        super(aggregateId, eventVersion);
        this.name = name;
        this.cost = cost;
        this.amountAvailable = amountAvailable;
        this.sellerId = sellerId;
    }

    public getEventName(): string {
        return 'ProductCreated';
    }

    public getEventData(): Record<string, any> {
        return {
            ...super.getEventData(),
            name: this.name,
            cost: this.cost,
            amountAvailable: this.amountAvailable,
            sellerId: this.sellerId,
        };
    }
}
