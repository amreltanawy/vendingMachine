import { DomainException } from "../../base/domain-exception";

/**
 * Exception thrown when product amount operations violate business rules.
 *
 * @class ProductAmountException
 * @extends {DomainException}
 */
export class ProductAmountException extends DomainException {
    /**
     * Creates an instance of ProductAmountException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "PRODUCT_AMOUNT_ERROR", context);
    }
}

/**
 * Exception thrown when product is not available for purchase.
 *
 * @class ProductNotAvailableException
 * @extends {DomainException}
 */
export class ProductNotAvailableException extends DomainException {
    /**
     * Creates an instance of ProductNotAvailableException.
     *
     * @param {string} productName - The name of the product
     * @param {number} available - Available quantity
     * @param {number} requested - Requested quantity
     */
    constructor(productName: string, available: number, requested: number) {
        super(
            `Product '${productName}' is not available. Available: ${available}, Requested: ${requested}`,
            "PRODUCT_NOT_AVAILABLE",
            { productName, available, requested },
        );
    }
}

/**
 * Exception thrown when product ownership operations violate business rules.
 *
 * @class ProductOwnershipException
 * @extends {DomainException}
 */
export class ProductOwnershipException extends DomainException {
    /**
     * Creates an instance of ProductOwnershipException.
     *
     * @param {string} productId - The product ID
     * @param {string} userId - The user ID attempting the operation
     * @param {string} ownerId - The actual owner ID
     */
    constructor(productId: string, userId: string, ownerId: string) {
        super(
            `Product ownership violation. Product ${productId} belongs to ${ownerId}, not ${userId}`,
            "PRODUCT_OWNERSHIP_ERROR",
            { productId, userId, ownerId },
        );
    }
}

/**
 * Exception thrown when product cost operations violate business rules.
 *
 * @class InvalidProductCostException
 * @extends {DomainException}
 */
export class InvalidProductCostException extends DomainException {
    /**
     * Creates an instance of InvalidProductCostException.
     *
     * @param {number} cost - The invalid cost
     */
    constructor(cost: number) {
        super(
            `Invalid product cost: ${cost}. Cost must be greater than zero`,
            "INVALID_PRODUCT_COST",
            { cost },
        );
    }
} 