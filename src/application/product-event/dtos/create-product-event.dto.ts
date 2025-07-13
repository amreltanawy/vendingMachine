// src/application/product-event/dtos/create-product-event.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsIn, IsOptional, Min } from 'class-validator';

export class CreateProductEventDto {
    @IsNotEmpty({ message: 'Product ID is required' })
    @IsString({ message: 'Product ID must be a string' })
    public readonly productId: string;

    @IsNotEmpty({ message: 'Event type is required' })
    @IsIn(['top_up', 'withdraw'], { message: 'Event type must be either "top_up" or "withdraw"' })
    public readonly eventType: 'top_up' | 'withdraw';

    @IsNotEmpty({ message: 'Quantity is required' })
    @IsNumber({}, { message: 'Quantity must be a number' })
    @Min(1, { message: 'Quantity must be at least 1' })
    public readonly quantity: number;

    @IsNotEmpty({ message: 'Unit price is required' })
    @IsNumber({}, { message: 'Unit price must be a number' })
    @Min(0, { message: 'Unit price cannot be negative' })
    public readonly unitPrice: number;

    @IsNotEmpty({ message: 'Description is required' })
    @IsString({ message: 'Description must be a string' })
    public readonly description: string;

    @IsOptional()
    public readonly metadata?: Record<string, any>;

    constructor(
        productId: string,
        eventType: 'top_up' | 'withdraw',
        quantity: number,
        unitPrice: number,
        description: string,
        metadata?: Record<string, any>
    ) {
        this.productId = productId;
        this.eventType = eventType;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.description = description;
        this.metadata = metadata;
    }
}
