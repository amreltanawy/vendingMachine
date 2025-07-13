// src/domain/product-event/repositories/product-event.repository.ts
import { ProductEvent } from '../entities/product-event.entity';
import { ProductEventId } from '../value-objects/product-event-id.vo';
import { ProductId } from '../../product/value-objects/product-id.vo';
import { UserId } from '../../user/value-objects/user-id.vo';
import { ProductEventType } from '../value-objects/product-event-type.vo';

/**
 * Abstract repository interface for managing product events.
 * 
 * This repository provides methods for persisting, retrieving, and querying
 * product events which track changes to products such as inventory updates,
 * price changes, and other product-related operations.
 */
export abstract class IProductEventRepository {
    /**
     * Finds a product event by its unique identifier.
     * 
     * @param id - The unique product event identifier
     * @returns Promise that resolves to the product event if found, null otherwise
     */
    abstract findById(id: ProductEventId): Promise<ProductEvent | null>;

    /**
     * Finds all product events associated with a specific product.
     * 
     * @param productId - The unique product identifier
     * @returns Promise that resolves to an array of product events for the specified product
     */
    abstract findByProductId(productId: ProductId): Promise<ProductEvent[]>;

    /**
     * Finds all product events created by a specific user.
     * 
     * @param userId - The unique user identifier who created the events
     * @returns Promise that resolves to an array of product events created by the user
     */
    abstract findByCreatedBy(userId: UserId): Promise<ProductEvent[]>;

    /**
     * Finds product events by product ID and event type.
     * 
     * @param productId - The unique product identifier
     * @param eventType - The type of product event to filter by
     * @returns Promise that resolves to an array of matching product events
     */
    abstract findByProductIdAndType(productId: ProductId, eventType: ProductEventType): Promise<ProductEvent[]>;

    /**
     * Finds product events within a specified date range.
     * 
     * @param startDate - The start date of the range (inclusive)
     * @param endDate - The end date of the range (inclusive)
     * @returns Promise that resolves to an array of product events within the date range
     */
    abstract findByDateRange(startDate: Date, endDate: Date): Promise<ProductEvent[]>;

    /**
     * Persists a product event to the repository.
     * 
     * @param productEvent - The product event entity to save
     * @returns Promise that resolves when the save operation is complete
     */
    abstract save(productEvent: ProductEvent): Promise<void>;

    /**
     * Deletes a product event from the repository.
     * 
     * @param id - The unique identifier of the product event to delete
     * @returns Promise that resolves when the delete operation is complete
     */
    abstract delete(id: ProductEventId): Promise<void>;

    /**
     * Counts the total number of product events in the repository.
     * 
     * @returns Promise that resolves to the total count of product events
     */
    abstract count(): Promise<number>;

    /**
     * Retrieves the complete inventory history for a specific product.
     * 
     * This method returns all inventory-related events for a product,
     * typically ordered chronologically to show the history of stock changes.
     * 
     * @param productId - The unique product identifier
     * @returns Promise that resolves to an array of inventory-related product events
     */
    abstract getInventoryHistory(productId: ProductId): Promise<ProductEvent[]>;

    /**
     * Retrieves an audit trail of events for a specific product.
     * 
     * This method provides a comprehensive log of all events that have occurred
     * for a product, useful for auditing and tracking changes over time.
     * 
     * @param productId - The unique product identifier
     * @param limit - Optional limit on the number of events to retrieve (most recent first)
     * @returns Promise that resolves to an array of product events forming the audit trail
     */
    abstract getAuditTrail(productId: ProductId, limit?: number): Promise<ProductEvent[]>;
}
