/**
 * Base class for all application-related exceptions.
 * Application exceptions represent use case failures and workflow errors.
 *
 * @abstract
 * @class ApplicationException
 * @extends {Error}
 */
export abstract class ApplicationException extends Error {
    /**
     * Creates an instance of ApplicationException.
     *
     * @param {string} message - The error message
     * @param {string} code - The error code for categorization
     * @param {number} httpStatus - HTTP status code for API responses
     * @param {any} [context] - Additional context information
     */
    constructor(
        message: string,
        public readonly code: string,
        public readonly httpStatus: number,
        public readonly context?: any,
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
} 