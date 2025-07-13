// src/application/product/handlers/get-product.handler.ts

import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { GetProductQuery } from '../queries/get-product.query';
import { IProductRepository } from '../../../domain/product/repositories/product.irepository';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { ProductId } from '../../../domain/product/value-objects/product-id.vo';
import { ProductNotFoundException } from '../exceptions/product-application.exceptions';

/**
 * Handler for retrieving a single product by ID.
 * This query can be executed by any user.
 * 
 * @class GetProductHandler
 * @implements {IQueryHandler<GetProductQuery>}
 */
@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
    /**
     * Creates an instance of GetProductHandler.
     * 
     * @param {IProductRepository} productRepository - Repository for product operations
     */
    constructor(private readonly productRepository: IProductRepository) { }

    /**
     * Executes the get product query.
     * 
     * @param {GetProductQuery} query - The query to execute
     * @returns {Promise<ProductResponseDto>} The product data
     * @throws {BadRequestException} When validation fails
     * @throws {ProductNotFoundException} When product is not found
     */
    async execute(query: GetProductQuery): Promise<ProductResponseDto> {
        // Validate input
        if (!query.productId) {
            throw new BadRequestException('Product ID is required');
        }

        try {
            // Find product
            const productId = ProductId.from(query.productId);
            const product = await this.productRepository.findById(productId);

            if (!product) {
                throw new ProductNotFoundException(query.productId);
            }

            // Map to response DTO
            return ProductResponseDto.fromDomain(product);
        } catch (error) {
            // Re-throw known application exceptions
            if (error instanceof ProductNotFoundException ||
                error instanceof BadRequestException) {
                throw error;
            }

            // Handle UUID validation errors
            if (error.message.includes('Invalid UUID')) {
                throw new BadRequestException('Invalid product ID format');
            }

            // Wrap unexpected errors
            throw new BadRequestException('Failed to retrieve product');
        }
    }
}
