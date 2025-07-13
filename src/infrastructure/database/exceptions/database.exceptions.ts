import { InfrastructureException } from "../../base/infrastructure-exception";

/**
 * Exception thrown when database connection fails.
 *
 * @class DatabaseConnectionException
 * @extends {InfrastructureException}
 */
export class DatabaseConnectionException extends InfrastructureException {
    /**
     * Creates an instance of DatabaseConnectionException.
     *
     * @param {Error} cause - The underlying error
     */
    constructor(cause: Error) {
        super(
            "Database connection failed",
            "DATABASE_CONNECTION_ERROR",
            cause,
        );
    }
}

/**
 * Exception thrown when database transaction fails.
 *
 * @class DatabaseTransactionException
 * @extends {InfrastructureException}
 */
export class DatabaseTransactionException extends InfrastructureException {
    /**
     * Creates an instance of DatabaseTransactionException.
     *
     * @param {string} operation - The failed operation
     * @param {Error} cause - The underlying error
     */
    constructor(operation: string, cause: Error) {
        super(
            `Database transaction failed: ${operation}`,
            "DATABASE_TRANSACTION_ERROR",
            cause,
        );
    }
}

/**
 * Exception thrown when database query fails.
 *
 * @class DatabaseQueryException
 * @extends {InfrastructureException}
 */
export class DatabaseQueryException extends InfrastructureException {
    /**
     * Creates an instance of DatabaseQueryException.
     *
     * @param {string} query - The failed query
     * @param {Error} cause - The underlying error
     */
    constructor(query: string, cause: Error) {
        super(
            `Database query failed: ${query}`,
            "DATABASE_QUERY_ERROR",
            cause,
        );
    }
}

/**
 * Exception thrown when database constraint is violated.
 *
 * @class DatabaseConstraintViolationException
 * @extends {InfrastructureException}
 */
export class DatabaseConstraintViolationException
    extends InfrastructureException {
    /**
     * Creates an instance of DatabaseConstraintViolationException.
     *
     * @param {string} constraint - The violated constraint
     * @param {Error} cause - The underlying error
     */
    constructor(constraint: string, cause: Error) {
        super(
            `Database constraint violation: ${constraint}`,
            "DATABASE_CONSTRAINT_VIOLATION",
            cause,
        );
    }
} 