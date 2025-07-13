/**
 * Base class for all domain-related exceptions.
 * Domain exceptions represent business rule violations and invariant breaches.
 *
 * @abstract
 * @class DomainException
 * @extends {Error}
 */
export abstract class DomainException extends Error {
    /**
     * Creates an instance of DomainException.
     *
     * @param {string} message - The error message
     * @param {string} code - The error code for categorization
     * @param {any} [context] - Additional context information
     */
    constructor(
        message: string,
        public readonly code: string,
        public readonly context?: any,
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
} 