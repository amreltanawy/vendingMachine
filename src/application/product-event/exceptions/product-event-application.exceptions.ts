import { ApplicationException } from "../../base/application-exception";

/**
 * Exception thrown when product event creation fails.
 *
 * @class ProductEventCreationException
 * @extends {ApplicationException}
 */
export class ProductEventCreationException extends ApplicationException {
    /**
     * Creates an instance of ProductEventCreationException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "PRODUCT_EVENT_CREATION_FAILED", 400, context);
    }
}

/**
 * Exception thrown when product event is not found.
 *
 * @class ProductEventNotFoundException
 * @extends {ApplicationException}
 */
export class ProductEventNotFoundException extends ApplicationException {
    /**
     * Creates an instance of ProductEventNotFoundException.
     *
     * @param {string} eventId - The product event ID
     */
    constructor(eventId: string) {
        super(
            `Product event not found: ${eventId}`,
            "PRODUCT_EVENT_NOT_FOUND",
            404,
            { eventId },
        );
    }
}

/**
 * Exception thrown when product event audit trail retrieval fails.
 *
 * @class ProductEventAuditException
 * @extends {ApplicationException}
 */
export class ProductEventAuditException extends ApplicationException {
    /**
     * Creates an instance of ProductEventAuditException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "PRODUCT_EVENT_AUDIT_FAILED", 400, context);
    }
} 