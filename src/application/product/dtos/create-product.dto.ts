// src/application/product/dtos/create-product.dto.ts

import { IsNotEmpty, IsString, IsNumber, Min, MaxLength } from 'class-validator';

/**
 * Data Transfer Object for product creation requests.
 * Validates input data at the presentation layer before
 * passing to the CreateProductCommand handler.
 * 
 * @class CreateProductDto
 */
export class CreateProductDto {
    @IsNotEmpty({ message: 'Product name is required' })
    @IsString({ message: 'Product name must be a string' })
    @MaxLength(100, { message: 'Product name cannot exceed 100 characters' })
    public readonly name: string;

    @IsNotEmpty({ message: 'Product cost is required' })
    @IsNumber({}, { message: 'Product cost must be a number' })
    @Min(1, { message: 'Product cost must be at least 1 cent' })
    public readonly cost: number;

    @IsNotEmpty({ message: 'Amount available is required' })
    @IsNumber({}, { message: 'Amount available must be a number' })
    @Min(0, { message: 'Amount available cannot be negative' })
    public readonly amountAvailable: number;

    @IsNotEmpty({ message: 'Seller ID is required' })
    @IsString({ message: 'Seller ID must be a string' })
    public readonly sellerId: string;

    /**
     * Creates an instance of CreateProductDto.
     * 
     * @param {string} name - The product name
     * @param {number} cost - The product cost in cents
     * @param {number} amountAvailable - The initial amount available
     * @param {string} sellerId - The ID of the seller creating the product
     */
    constructor(name: string, cost: number, amountAvailable: number, sellerId: string) {
        this.name = name;
        this.cost = cost;
        this.amountAvailable = amountAvailable;
        this.sellerId = sellerId;
    }
}
