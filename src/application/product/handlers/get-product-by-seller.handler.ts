// src/application/product/handlers/get-products-by-seller.handler.ts

import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { GetProductsBySellerQuery } from '../queries/get-products-by-seller.query';
import { IProductRepository } from '../../../domain/product/repositories/product.irepository';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';

/**
 * Handler for retrieving products created by a specific seller.
 * This query supports pagination and is typically used by sellers to view their own products.
 * 
 * @class GetProductsBySellerHandler
 * @implements {IQueryHandler<GetProductsBySellerQuery>}
 */
@QueryHandler(GetProductsBySellerQuery)
export class GetProductsBySellerHandler implements IQueryHandler<GetProductsBySellerQuery> {
    /**
     * Creates an instance of GetProductsBySellerHandler.
     * 
     * @param {IProductRepository} productRepository - Repository for product operations
     */
    constructor(private readonly productRepository: IProductRepository) { }

    /**
     * Executes the get products by seller query.
     * 
     * @param {GetProductsBySellerQuery} query - The query to execute
     * @returns {Promise<ProductResponseDto[]>} Array of product data
     * @throws {BadRequestException} When validation fails
     */
    async execute(query: GetProductsBySellerQuery): Promise<ProductResponseDto[]> {
        // Validate input
        if (!query.sellerId) {
            throw new BadRequestException('Seller ID is required');
        }

        // Validate pagination parameters
        if (query.page < 1) {
            throw new BadRequestException('Page must be greater than 0');
        }

        if (query.limit < 1 || query.limit > 100) {
            throw new BadRequestException('Limit must be between 1 and 100');
        }

        try {
            // Find products by seller
            const sellerId = UserId.from(query.sellerId);
            const products = await this.productRepository.findBySellerId(sellerId);

            // Apply pagination
            const startIndex = (query.page - 1) * query.limit;
            const endIndex = startIndex + query.limit;
            const paginatedProducts = products.slice(startIndex, endIndex);

            // Map to response DTOs
            return paginatedProducts.map(product => ProductResponseDto.fromDomain(product));
        } catch (error) {
            if (error.message.includes('Invalid UUID')) {
                throw new BadRequestException('Invalid seller ID format');
            }
            throw new BadRequestException('Failed to retrieve products');
        }
    }
}
