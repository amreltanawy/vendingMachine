// src/domain/product-event/entities/product-event.entity.ts
import { AggregateRoot } from '@nestjs/cqrs';
import { ProductEventId } from '../value-objects/product-event-id.vo';
import { ProductId } from '../../product/value-objects/product-id.vo';
import { UserId } from '../../user/value-objects/user-id.vo';
import { ProductEventType } from '../value-objects/product-event-type.vo';
import { Money } from '../../shared/value-objects/money.vo';
import { ProductEventCreatedEvent } from '../events/product-event-created.event';

export class ProductEvent extends AggregateRoot {
  private constructor(
    private readonly _id: ProductEventId,
    private readonly _productId: ProductId,
    private readonly _eventType: ProductEventType,
    private readonly _quantity: number,
    private readonly _unitPrice: Money,
    private readonly _totalValue: Money,
    private readonly _createdBy: UserId,
    private readonly _createdAt: Date,
    private readonly _description: string,
    private readonly _metadata?: Record<string, any>
  ) {
    super();
  }

  static create(
    id: ProductEventId,
    productId: ProductId,
    eventType: ProductEventType,
    quantity: number,
    unitPrice: Money,
    createdBy: UserId,
    description: string,
    metadata?: Record<string, any>
  ): ProductEvent {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    const totalValue = Money.fromCents(unitPrice.cents * quantity);

    const productEvent = new ProductEvent(
      id,
      productId,
      eventType,
      quantity,
      unitPrice,
      totalValue,
      createdBy,
      new Date(),
      description,
      metadata
    );

    productEvent.apply(new ProductEventCreatedEvent(
      id,
      productId,
      eventType,
      quantity,
      unitPrice,
      totalValue,
      createdBy,
      new Date(),
      description,
      metadata
    ));

    return productEvent;
  }

  static createTopUpEvent(
    productId: ProductId,
    quantity: number,
    unitPrice: Money,
    sellerId: UserId,
    description: string = 'Product inventory top up'
  ): ProductEvent {
    return ProductEvent.create(
      ProductEventId.create(),
      productId,
      ProductEventType.topUp(),
      quantity,
      unitPrice,
      sellerId,
      description,
      { operation: 'inventory_increase' }
    );
  }

  static createWithdrawEvent(
    productId: ProductId,
    quantity: number,
    unitPrice: Money,
    buyerId: UserId,
    purchaseOrderId?: string,
    description: string = 'Product purchased'
  ): ProductEvent {
    return ProductEvent.create(
      ProductEventId.create(),
      productId,
      ProductEventType.withdraw(),
      quantity,
      unitPrice,
      buyerId,
      description,
      {
        operation: 'inventory_decrease',
        purchaseOrderId: purchaseOrderId || null
      }
    );
  }

  get id(): ProductEventId {
    return this._id;
  }

  get productId(): ProductId {
    return this._productId;
  }

  get eventType(): ProductEventType {
    return this._eventType;
  }

  get quantity(): number {
    return this._quantity;
  }

  get unitPrice(): Money {
    return this._unitPrice;
  }

  get totalValue(): Money {
    return this._totalValue;
  }

  get createdBy(): UserId {
    return this._createdBy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get description(): string {
    return this._description;
  }

  get metadata(): Record<string, any> | undefined {
    return this._metadata ? { ...this._metadata } : undefined;
  }

  isTopUp(): boolean {
    return this._eventType.isTopUp();
  }

  isWithdraw(): boolean {
    return this._eventType.isWithdraw();
  }

  getInventoryImpact(): number {
    return this.isTopUp() ? this._quantity : -this._quantity;
  }
}
