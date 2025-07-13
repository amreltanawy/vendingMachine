// src/application/product/handlers/get-all-products.handler.ts

import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { GetAllProductsQuery } from '../queries/get-all-products.query';
import { IProductRepository } from '../../../domain/product/repositories/product.irepository';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';

/**
 * Handler for retrieving all products with pagination support.
 * This query can be executed by any user.
 * 
 * @class GetAllProductsHandler
 * @implements {IQueryHandler<GetAllProductsQuery>}
 */
@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler implements IQueryHandler<GetAllProductsQuery> {
    /**
     * Creates an instance of GetAllProductsHandler.
     * 
     * @param {IProductRepository} productRepository - Repository for product operations
     */
    constructor(private readonly productRepository: IProductRepository) { }

    /**
     * Executes the get all products query.
     * 
     * @param {GetAllProductsQuery} query - The query to execute
     * @returns {Promise<ProductResponseDto[]>} Array of product data
     * @throws {BadRequestException} When validation fails
     */
    async execute(query: GetAllProductsQuery): Promise<ProductResponseDto[]> {
        // Validate pagination parameters
        if (query.page < 1) {
            throw new BadRequestException('Page must be greater than 0');
        }

        if (query.limit < 1 || query.limit > 100) {
            throw new BadRequestException('Limit must be between 1 and 100');
        }

        try {
            let products;

            if (query.sellerId) {
                // Filter by seller
                const sellerId = UserId.from(query.sellerId);
                products = await this.productRepository.findBySellerId(sellerId);
            } else {
                // Get all products
                products = await this.productRepository.findAll();
            }

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
