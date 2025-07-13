import { DomainException } from "../../base/domain-exception";

/**
 * Exception thrown when vending machine operations violate business rules.
 *
 * @class VendingMachineException
 * @extends {DomainException}
 */
export class VendingMachineException extends DomainException {
    /**
     * Creates an instance of VendingMachineException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "VENDING_MACHINE_ERROR", context);
    }
}

/**
 * Exception thrown when change calculation fails.
 *
 * @class ChangeCalculationException
 * @extends {DomainException}
 */
export class ChangeCalculationException extends DomainException {
    /**
     * Creates an instance of ChangeCalculationException.
     *
     * @param {number} amount - The amount for which change cannot be calculated
     */
    constructor(amount: number) {
        super(
            `Cannot calculate change for amount: ${amount} cents`,
            "CHANGE_CALCULATION_ERROR",
            { amount },
        );
    }
}

/**
 * Exception thrown when purchase transaction fails.
 *
 * @class PurchaseTransactionException
 * @extends {DomainException}
 */
export class PurchaseTransactionException extends DomainException {
    /**
     * Creates an instance of PurchaseTransactionException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "PURCHASE_TRANSACTION_ERROR", context);
    }
} 