// src/domain/product/entities/product.entity.ts
import { AggregateRoot } from '@nestjs/cqrs';
import { ProductId } from '../value-objects/product-id.vo';
import { Money } from '../../shared/value-objects/money.vo';
import { UserId } from '../../user/value-objects/user-id.vo';
import { ProductCreatedEvent } from '../events/product-created.event';
import { ProductPurchasedEvent } from '../events/product-purchased.event';

export class Product extends AggregateRoot {
    private constructor(
        private readonly _id: ProductId,
        private _name: string,
        private _cost: Money,
        private _amountAvailable: number,
        private readonly _sellerId: UserId,
        private _createdAt?: Date,
        private _updatedAt?: Date
    ) {
        super();
    }

    static create(
        id: ProductId,
        name: string,
        cost: Money,
        amountAvailable: number,
        sellerId: UserId,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ): Product {
        if (amountAvailable < 0) {
            throw new Error('Amount available cannot be negative');
        }

        const product = new Product(id, name, cost, amountAvailable, sellerId, createdAt, updatedAt);
        product.apply(new ProductCreatedEvent(id.value, name, cost, amountAvailable, sellerId));
        return product;
    }

    get id(): ProductId {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get cost(): Money {
        return this._cost;
    }

    get amountAvailable(): number {
        return this._amountAvailable;
    }

    get sellerId(): UserId {
        return this._sellerId;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    updateName(name: string): void {
        this._name = name;
    }

    updateCost(cost: Money): void {
        this._cost = cost;
    }

    isAvailable(): boolean {
        return this._amountAvailable > 0;
    }

    canBeUpdatedBy(userId: UserId): boolean {
        return this._sellerId.equals(userId);
    }

    purchase(quantity: number): void {
        if (!this.isAvailable()) {
            throw new Error('Product is not available');
        }

        if (this._amountAvailable < quantity) {
            throw new Error('Insufficient product quantity');
        }

        this._amountAvailable -= quantity;
        this.apply(new ProductPurchasedEvent(this._id.value, this._name, this._cost, this._amountAvailable, this._sellerId));
    }

    updateAmount(newAmount: number): void {
        if (newAmount < 0) {
            throw new Error('Amount cannot be negative');
        }
        this._amountAvailable = newAmount;
    }
}
