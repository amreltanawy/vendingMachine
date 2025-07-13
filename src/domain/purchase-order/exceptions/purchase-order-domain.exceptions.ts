import { DomainException } from "../../base/domain-exception";

/**
 * Exception thrown when purchase order operations violate business rules.
 *
 * @class PurchaseOrderException
 * @extends {DomainException}
 */
export class PurchaseOrderException extends DomainException {
    /**
     * Creates an instance of PurchaseOrderException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "PURCHASE_ORDER_ERROR", context);
    }
}

/**
 * Exception thrown when purchase order state transitions are invalid.
 *
 * @class InvalidPurchaseOrderStateException
 * @extends {DomainException}
 */
export class InvalidPurchaseOrderStateException extends DomainException {
    /**
     * Creates an instance of InvalidPurchaseOrderStateException.
     *
     * @param {string} currentState - The current state
     * @param {string} attemptedAction - The attempted action
     */
    constructor(currentState: string, attemptedAction: string) {
        super(
            `Cannot perform action '${attemptedAction}' on purchase order in state '${currentState}'`,
            "INVALID_PURCHASE_ORDER_STATE",
            { currentState, attemptedAction },
        );
    }
}

/**
 * Exception thrown when purchase order contains invalid items.
 *
 * @class InvalidPurchaseOrderItemsException
 * @extends {DomainException}
 */
export class InvalidPurchaseOrderItemsException extends DomainException {
    /**
     * Creates an instance of InvalidPurchaseOrderItemsException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "INVALID_PURCHASE_ORDER_ITEMS", context);
    }
} 