// src/application/product/dtos/product-response.dto.ts

import { Product } from '../../../domain/product/entities/product.entity';

/**
 * Data Transfer Object for product query responses.
 * Represents the safe, public view of product data that can be
 * returned to clients.
 * 
 * @class ProductResponseDto
 */
export class ProductResponseDto {
    public readonly id: string;
    public readonly name: string;
    public readonly cost: number;
    public readonly amountAvailable: number;
    public readonly sellerId: string;
    public readonly createdAt: Date | null;
    public readonly updatedAt: Date | null;

    /**
     * Creates an instance of ProductResponseDto.
     * 
     * @param {string} id - The product ID
     * @param {string} name - The product name
     * @param {number} cost - The product cost in cents
     * @param {number} amountAvailable - The amount available
     * @param {string} sellerId - The seller ID
     * @param {Date} createdAt - The creation date
     * @param {Date} updatedAt - The last update date
     */
    constructor(
        id: string,
        name: string,
        cost: number,
        amountAvailable: number,
        sellerId: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.amountAvailable = amountAvailable;
        this.sellerId = sellerId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Factory method to create ProductResponseDto from domain entity.
     * 
     * @param {Product} product - The product domain entity
     * @returns {ProductResponseDto} The response DTO
     */
    public static fromDomain(product: Product): ProductResponseDto {
        return new ProductResponseDto(
            product.id.value,
            product.name,
            product.cost.cents,
            product.amountAvailable,
            product.sellerId.value,
            product.createdAt,
            product.updatedAt
        );
    }
}
