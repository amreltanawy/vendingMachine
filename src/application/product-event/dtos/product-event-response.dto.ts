// src/application/product-event/dtos/product-event-response.dto.ts
import { ProductEvent } from '../../../domain/product-event/entities/product-event.entity';

export class ProductEventResponseDto {
    public readonly id: string;
    public readonly productId: string;
    public readonly eventType: string;
    public readonly quantity: number;
    public readonly unitPrice: number;
    public readonly totalValue: number;
    public readonly createdBy: string;
    public readonly createdAt: Date;
    public readonly description: string;
    public readonly metadata?: Record<string, any>;

    constructor(
        id: string,
        productId: string,
        eventType: string,
        quantity: number,
        unitPrice: number,
        totalValue: number,
        createdBy: string,
        createdAt: Date,
        description: string,
        metadata?: Record<string, any>
    ) {
        this.id = id;
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

    public static fromDomain(event: ProductEvent): ProductEventResponseDto {
        return new ProductEventResponseDto(
            event.id.value,
            event.productId.value,
            event.eventType.value,
            event.quantity,
            event.unitPrice.cents,
            event.totalValue.cents,
            event.createdBy.value,
            event.createdAt,
            event.description,
            event.metadata
        );
    }
}
