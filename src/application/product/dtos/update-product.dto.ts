// src/application/product/dtos/update-product.dto.ts

import { IsOptional, IsString, IsNumber, Min, MaxLength } from 'class-validator';

/**
 * Data Transfer Object for product update requests.
 * All fields are optional since updates can be partial.
 * 
 * @class UpdateProductDto
 */
export class UpdateProductDto {
    @IsOptional()
    @IsString({ message: 'Product name must be a string' })
    @MaxLength(100, { message: 'Product name cannot exceed 100 characters' })
    public readonly name?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Product cost must be a number' })
    @Min(1, { message: 'Product cost must be at least 1 cent' })
    public readonly cost?: number;

    @IsOptional()
    @IsNumber({}, { message: 'Amount available must be a number' })
    @Min(0, { message: 'Amount available cannot be negative' })
    public readonly amountAvailable?: number;

    @IsOptional()
    @IsString({ message: 'Seller ID must be a string' })
    public readonly sellerId?: string;

    /**
     * Creates an instance of UpdateProductDto.
     * 
     * @param {string} [name] - Optional new product name
     * @param {number} [cost] - Optional new product cost in cents
     * @param {number} [amountAvailable] - Optional new amount available
     * @param {string} [sellerId] - Optional new seller ID
     */
    constructor(name?: string, cost?: number, amountAvailable?: number, sellerId?: string) {
        this.name = name;
        this.cost = cost;
        this.amountAvailable = amountAvailable;
        this.sellerId = sellerId;
    }
}
