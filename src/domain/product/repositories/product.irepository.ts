// src/domain/user/repositories/user.repository.ts
import { UserId } from 'src/domain/user/value-objects/user-id.vo';
import { Product } from '../entities/product.entity';
import { ProductId } from '../value-objects/product-id.vo';

/**
 * Domain repository interface for Product aggregate.
 * Defines the contract for product persistence operations.
 * This interface lives in the domain layer and is implemented
 * by the infrastructure layer, following the Dependency Inversion Principle.
 */
export abstract class IProductRepository {
    /**
     * Find product by unique identifier.
     * @param id - Product unique identifier
     * @returns Product entity or null if not found
     */
    abstract findById(id: ProductId): Promise<Product | null>;

    /**
     * Find product by seller ID and name.
     * @param sellerId - Seller unique identifier
     * @param name - Product name
     * @returns Product entity or null if not found
     */
    abstract findBySellerIdAndName(sellerId: UserId, name: string): Promise<Product | null>;

    /**
     * Find products by seller ID.
     * @param sellerId - Seller unique identifier
     * @returns Array of product entities
     */
    abstract findBySellerId(sellerId: UserId): Promise<Product[]>;

    /**
     * Save or update product aggregate.
     * @param product - Product
     */
    abstract save(product: Product): Promise<void>;

    /**
     * Delete product by identifier.
     * @param id - Product unique identifier
     */
    abstract delete(id: ProductId): Promise<void>;

    /**
     * Find all products.
     * @returns Array of product entities
     */
    abstract findAll(): Promise<Product[]>;

}
