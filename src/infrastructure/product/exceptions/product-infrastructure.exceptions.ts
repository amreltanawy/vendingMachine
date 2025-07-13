import { InfrastructureException } from "../../base/infrastructure-exception";

/**
 * Exception thrown when product repository operations fail.
 *
 * @class ProductRepositoryException
 * @extends {InfrastructureException}
 */
export class ProductRepositoryException extends InfrastructureException {
    /**
     * Creates an instance of ProductRepositoryException.
     *
     * @param {string} operation - The failed operation
     * @param {Error} cause - The underlying error
     * @param {any} [context] - Additional context information
     */
    constructor(operation: string, cause: Error, context?: any) {
        super(
            `Product repository operation failed: ${operation}`,
            "PRODUCT_REPOSITORY_ERROR",
            cause,
            context,
        );
    }
}

/**
 * Exception thrown when product database constraints are violated.
 *
 * @class ProductConstraintException
 * @extends {InfrastructureException}
 */
export class ProductConstraintException extends InfrastructureException {
    /**
     * Creates an instance of ProductConstraintException.
     *
     * @param {string} constraint - The violated constraint
     * @param {Error} cause - The underlying error
     */
    constructor(constraint: string, cause: Error) {
        super(
            `Product database constraint violated: ${constraint}`,
            "PRODUCT_CONSTRAINT_ERROR",
            cause,
        );
    }
} 