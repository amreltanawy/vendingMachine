// src/application/product/queries/get-product.query.ts

import { IQuery } from '@nestjs/cqrs';

/**
 * Query to retrieve a single product by its ID.
 * This query can be executed by any user (buyer or seller).
 * 
 * @class GetProductQuery
 * @implements {IQuery}
 */
export class GetProductQuery implements IQuery {
    /**
     * Creates an instance of GetProductQuery.
     * 
     * @param {string} productId - The ID of the product to retrieve
     */
    constructor(public readonly productId: string) { }
}
