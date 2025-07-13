// src/application/product/queries/get-products-by-seller.query.ts

import { IQuery } from '@nestjs/cqrs';

/**
 * Query to retrieve all products created by a specific seller.
 * This query is typically used by sellers to view their own products.
 * 
 * @class GetProductsBySellerQuery
 * @implements {IQuery}
 */
export class GetProductsBySellerQuery implements IQuery {
    /**
     * Creates an instance of GetProductsBySellerQuery.
     * 
     * @param {string} sellerId - The ID of the seller whose products to retrieve
     * @param {number} [page=1] - The page number for pagination
     * @param {number} [limit=10] - The number of products per page
     */
    constructor(
        public readonly sellerId: string,
        public readonly page: number = 1,
        public readonly limit: number = 10
    ) { }
}
