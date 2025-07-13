// src/application/product/queries/get-all-products.query.ts

import { IQuery } from '@nestjs/cqrs';

/**
 * Query to retrieve all products in the vending machine.
 * This query can be executed by any user and supports pagination.
 * 
 * @class GetAllProductsQuery
 * @implements {IQuery}
 */
export class GetAllProductsQuery implements IQuery {
    /**
     * Creates an instance of GetAllProductsQuery.
     * 
     * @param {number} [page=1] - The page number for pagination
     * @param {number} [limit=10] - The number of products per page
     * @param {string} [sellerId] - Optional filter by seller ID
     */
    constructor(
        public readonly page: number = 1,
        public readonly limit: number = 10,
        public readonly sellerId?: string
    ) { }
}
