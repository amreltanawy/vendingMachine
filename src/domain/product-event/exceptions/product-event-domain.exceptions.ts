import { DomainException } from "../../base/domain-exception";

/**
 * Exception thrown when product event operations violate business rules.
 *
 * @class ProductEventException
 * @extends {DomainException}
 */
export class ProductEventException extends DomainException {
    /**
     * Creates an instance of ProductEventException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "PRODUCT_EVENT_ERROR", context);
    }
}

/**
 * Exception thrown when invalid product event type is used.
 *
 * @class InvalidProductEventTypeException
 * @extends {DomainException}
 */
export class InvalidProductEventTypeException extends DomainException {
    /**
     * Creates an instance of InvalidProductEventTypeException.
     *
     * @param {string} eventType - The invalid event type
     * @param {string[]} validTypes - List of valid event types
     */
    constructor(eventType: string, validTypes: string[]) {
        super(
            `Invalid product event type: ${eventType}. Valid types: ${validTypes.join(", ")
            }`,
            "INVALID_PRODUCT_EVENT_TYPE",
            { eventType, validTypes },
        );
    }
}

/**
 * Exception thrown when product event quantity is invalid.
 *
 * @class InvalidProductEventQuantityException
 * @extends {DomainException}
 */
export class InvalidProductEventQuantityException extends DomainException {
    /**
     * Creates an instance of InvalidProductEventQuantityException.
     *
     * @param {number} quantity - The invalid quantity
     */
    constructor(quantity: number) {
        super(
            `Invalid product event quantity: ${quantity}. Quantity must be greater than zero`,
            "INVALID_PRODUCT_EVENT_QUANTITY",
            { quantity },
        );
    }
} 