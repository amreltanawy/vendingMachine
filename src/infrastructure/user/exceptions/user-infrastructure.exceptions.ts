import { InfrastructureException } from "../../base/infrastructure-exception";

/**
 * Exception thrown when user repository operations fail.
 *
 * @class UserRepositoryException
 * @extends {InfrastructureException}
 */
export class UserRepositoryException extends InfrastructureException {
    /**
     * Creates an instance of UserRepositoryException.
     *
     * @param {string} operation - The failed operation
     * @param {Error} cause - The underlying error
     * @param {any} [context] - Additional context information
     */
    constructor(operation: string, cause: Error, context?: any) {
        super(
            `User repository operation failed: ${operation}`,
            "USER_REPOSITORY_ERROR",
            cause,
            context,
        );
    }
}

/**
 * Exception thrown when user credential operations fail.
 *
 * @class UserCredentialException
 * @extends {InfrastructureException}
 */
export class UserCredentialException extends InfrastructureException {
    /**
     * Creates an instance of UserCredentialException.
     *
     * @param {string} operation - The failed operation
     * @param {Error} cause - The underlying error
     */
    constructor(operation: string, cause: Error) {
        super(
            `User credential operation failed: ${operation}`,
            "USER_CREDENTIAL_ERROR",
            cause,
        );
    }
}

/**
 * Exception thrown when password hashing/verification fails.
 *
 * @class PasswordHashingException
 * @extends {InfrastructureException}
 */
export class PasswordHashingException extends InfrastructureException {
    /**
     * Creates an instance of PasswordHashingException.
     *
     * @param {string} operation - The failed operation (hash/verify)
     * @param {Error} cause - The underlying error
     */
    constructor(operation: string, cause: Error) {
        super(
            `Password ${operation} operation failed`,
            "PASSWORD_HASHING_ERROR",
            cause,
        );
    }
} 