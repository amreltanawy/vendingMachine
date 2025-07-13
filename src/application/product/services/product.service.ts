// src/application/product/services/product.service.ts

import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from '../commands/create-product.command';
import { UpdateProductCommand } from '../commands/update-product.command';
import { DeleteProductCommand } from '../commands/delete-product.command';
import { GetProductQuery } from '../queries/get-product.query';
import { GetAllProductsQuery } from '../queries/get-all-products.query';
import { GetProductsBySellerQuery } from '../queries/get-products-by-seller.query';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { PurchaseProductCommand } from '../commands/purchase-product.command';
import { PurchaseResult } from '../dtos/purchase-result.dto';

/**
 * Application service for product operations.
 * Provides a high-level facade for product-related use cases,
 * abstracting away the complexity of CQRS commands and queries.
 * 
 * @class ProductApplicationService
 */
@Injectable()
export class ProductApplicationService {
    /**
     * Creates an instance of ProductApplicationService.
     * 
     * @param {CommandBus} commandBus - CQRS command bus
     * @param {QueryBus} queryBus - CQRS query bus
     */
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    /**
     * Creates a new product.
     * 
     * @param {string} sellerId - The ID of the seller creating the product
     * @param {CreateProductDto} dto - The product creation data
     * @returns {Promise<string>} The ID of the created product
     */
    async createProduct(sellerId: string, dto: CreateProductDto): Promise<string> {
        const command = new CreateProductCommand(
            dto.name,
            dto.cost,
            dto.amountAvailable,
            sellerId
        );
        return await this.commandBus.execute(command);
    }

    /**
     * Updates an existing product.
     * 
     * @param {string} sellerId - The ID of the seller updating the product
     * @param {string} productId - The ID of the product to update
     * @param {UpdateProductDto} dto - The product update data
     * @returns {Promise<void>}
     */
    async updateProduct(sellerId: string, productId: string, dto: UpdateProductDto): Promise<void> {
        const command = new UpdateProductCommand(
            productId,
            sellerId,
            dto.name,
            dto.cost,
            dto.amountAvailable
        );
        await this.commandBus.execute(command);
    }

    /**
     * Deletes a product.
     * 
     * @param {string} sellerId - The ID of the seller deleting the product
     * @param {string} productId - The ID of the product to delete
     * @returns {Promise<void>}
     */
    async deleteProduct(sellerId: string, productId: string): Promise<void> {
        const command = new DeleteProductCommand(productId, sellerId);
        await this.commandBus.execute(command);
    }

    /**
     * Retrieves a single product by ID.
     * 
     * @param {string} productId - The ID of the product to retrieve
     * @returns {Promise<ProductResponseDto>} The product data
     */
    async getProduct(productId: string): Promise<ProductResponseDto> {
        const query = new GetProductQuery(productId);
        return await this.queryBus.execute(query);
    }

    /**
     * Retrieves all products with pagination.
     * 
     * @param {number} [page=1] - The page number
     * @param {number} [limit=10] - The number of products per page
     * @param {string} [sellerId] - Optional filter by seller ID
     * @returns {Promise<ProductResponseDto[]>} Array of product data
     */
    async getAllProducts(
        page: number = 1,
        limit: number = 10,
        sellerId?: string
    ): Promise<ProductResponseDto[]> {
        const query = new GetAllProductsQuery(page, limit, sellerId);
        return await this.queryBus.execute(query);
    }

    /**
     * Retrieves products created by a specific seller.
     * 
     * @param {string} sellerId - The ID of the seller
     * @param {number} [page=1] - The page number
     * @param {number} [limit=10] - The number of products per page
     * @returns {Promise<ProductResponseDto[]>} Array of product data
     */
    async getProductsBySeller(
        sellerId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<ProductResponseDto[]> {
        const query = new GetProductsBySellerQuery(sellerId, page, limit);
        return await this.queryBus.execute(query);
    }

    /**
     * Purchases a product from the vending machine.
     * 
     * @param {string} userId - The ID of the user making the purchase
     * @param {string} productId - The ID of the product to purchase
     * @param {number} quantity - The quantity to purchase
     * @returns {Promise<PurchaseResult>} The purchase result
     */
    async purchaseProduct(
        userId: string,
        productId: string,
        quantity: number
    ): Promise<PurchaseResult> {
        const command = new PurchaseProductCommand(userId, productId, quantity);
        return await this.commandBus.execute(command);
    }
}
