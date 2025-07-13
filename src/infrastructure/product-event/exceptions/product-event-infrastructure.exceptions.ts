import { InfrastructureException } from "../../base/infrastructure-exception";

/**
 * Exception thrown when product event repository operations fail.
 *
 * @class ProductEventRepositoryException
 * @extends {InfrastructureException}
 */
export class ProductEventRepositoryException extends InfrastructureException {
    /**
     * Creates an instance of ProductEventRepositoryException.
     *
     * @param {string} operation - The failed operation
     * @param {Error} cause - The underlying error
     * @param {any} [context] - Additional context information
     */
    constructor(operation: string, cause: Error, context?: any) {
        super(
            `Product event repository operation failed: ${operation}`,
            "PRODUCT_EVENT_REPOSITORY_ERROR",
            cause,
            context,
        );
    }
}

/**
 * Exception thrown when product event persistence fails.
 *
 * @class ProductEventPersistenceException
 * @extends {InfrastructureException}
 */
export class ProductEventPersistenceException extends InfrastructureException {
    /**
     * Creates an instance of ProductEventPersistenceException.
     *
     * @param {string} operation - The failed operation
     * @param {Error} cause - The underlying error
     */
    constructor(operation: string, cause: Error) {
        super(
            `Product event persistence failed: ${operation}`,
            "PRODUCT_EVENT_PERSISTENCE_ERROR",
            cause,
        );
    }
} 