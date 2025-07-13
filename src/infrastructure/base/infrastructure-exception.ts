/**
 * Base class for all infrastructure-related exceptions.
 * Infrastructure exceptions represent technical failures and external service errors.
 *
 * @abstract
 * @class InfrastructureException
 * @extends {Error}
 */
export abstract class InfrastructureException extends Error {
    /**
     * Creates an instance of InfrastructureException.
     *
     * @param {string} message - The error message
     * @param {string} code - The error code for categorization
     * @param {Error} [cause] - The underlying cause of the error
     * @param {any} [context] - Additional context information
     */
    constructor(
        message: string,
        public readonly code: string,
        public readonly cause?: Error,
        public readonly context?: any,
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
} 