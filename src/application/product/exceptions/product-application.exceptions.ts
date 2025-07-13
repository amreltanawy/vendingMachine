import { ApplicationException } from "../../base/application-exception";

/**
 * Exception thrown when product creation fails.
 *
 * @class ProductCreationException
 * @extends {ApplicationException}
 */
export class ProductCreationException extends ApplicationException {
    /**
     * Creates an instance of ProductCreationException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "PRODUCT_CREATION_FAILED", 400, context);
    }
}

/**
 * Exception thrown when product is not found.
 *
 * @class ProductNotFoundException
 * @extends {ApplicationException}
 */
export class ProductNotFoundException extends ApplicationException {
    /**
     * Creates an instance of ProductNotFoundException.
     *
     * @param {string} productId - The product ID
     */
    constructor(productId: string) {
        super(
            `Product not found: ${productId}`,
            "PRODUCT_NOT_FOUND",
            404,
            { productId },
        );
    }
}

/**
 * Exception thrown when product update fails due to validation errors.
 *
 * @class ProductUpdateException
 * @extends {ApplicationException}
 */
export class ProductUpdateException extends ApplicationException {
    /**
     * Creates an instance of ProductUpdateException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "PRODUCT_UPDATE_FAILED", 400, context);
    }
}

/**
 * Exception thrown when product deletion fails.
 *
 * @class ProductDeletionException
 * @extends {ApplicationException}
 */
export class ProductDeletionException extends ApplicationException {
    /**
     * Creates an instance of ProductDeletionException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "PRODUCT_DELETION_FAILED", 400, context);
    }
}

/**
 * Exception thrown when duplicate product name is detected for the same seller.
 *
 * @class DuplicateProductNameException
 * @extends {ApplicationException}
 */
export class DuplicateProductNameException extends ApplicationException {
    /**
     * Creates an instance of DuplicateProductNameException.
     *
     * @param {string} productName - The duplicate product name
     * @param {string} sellerId - The seller ID
     */
    constructor(productName: string, sellerId: string) {
        super(
            `Product with name '${productName}' already exists for seller ${sellerId}`,
            "DUPLICATE_PRODUCT_NAME",
            409,
            { productName, sellerId },
        );
    }
} 