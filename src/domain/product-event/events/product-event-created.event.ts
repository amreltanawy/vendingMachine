// src/domain/user/events/user-created.event.ts
import { DomainEvent, IDomainEvent } from '../../shared/base/event';
import { Money } from '../../shared/value-objects/money.vo';
import { UserId } from '../../user/value-objects/user-id.vo';
import { ProductId } from 'src/domain/product/value-objects/product-id.vo';
import { ProductEventType } from '../value-objects/product-event-type.vo';
import { ProductEventId } from '../value-objects/product-event-id.vo';


export interface IProductEventCreatedEvent extends IDomainEvent {
    productId: ProductId;
    eventType: ProductEventType;
    quantity: number;
    unitPrice: Money;
    totalValue: Money;
    createdBy: UserId;
    createdAt: Date;
    description: string;
    metadata?: Record<string, any>;
}

export class ProductEventCreatedEvent extends DomainEvent implements IProductEventCreatedEvent {
    public readonly productId: ProductId;
    public readonly eventType: ProductEventType;
    public readonly quantity: number;
    public readonly unitPrice: Money;
    public readonly totalValue: Money;
    public readonly createdBy: UserId;
    public readonly createdAt: Date;
    public readonly description: string;
    public readonly metadata?: Record<string, any>;

    constructor(
        aggregateId: ProductEventId,
        productId: ProductId,
        eventType: ProductEventType,
        quantity: number,
        unitPrice: Money,
        totalValue: Money,
        createdBy: UserId,
        createdAt: Date,
        description: string,
        metadata?: Record<string, any>,
        eventVersion: number = 1
    ) {
        super(aggregateId.toString(), eventVersion);
        this.productId = productId;
        this.eventType = eventType;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalValue = totalValue;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.description = description;
        this.metadata = metadata;
    }

    public getEventName(): string {
        return 'ProductEventCreated';
    }

    public getEventData(): Record<string, any> {
        return {
            ...super.getEventData(),
            productId: this.productId,
            eventType: this.eventType,
            quantity: this.quantity,
            unitPrice: this.unitPrice,
            totalValue: this.totalValue,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
            description: this.description,
            metadata: this.metadata,
        };
    }
}
