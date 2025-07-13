import { ApplicationException } from "../../base/application-exception";

/**
 * Exception thrown when vending machine purchase fails.
 *
 * @class VendingMachinePurchaseException
 * @extends {ApplicationException}
 */
export class VendingMachinePurchaseException extends ApplicationException {
    /**
     * Creates an instance of VendingMachinePurchaseException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "VENDING_MACHINE_PURCHASE_FAILED", 400, context);
    }
}

/**
 * Exception thrown when deposit operation fails.
 *
 * @class DepositOperationException
 * @extends {ApplicationException}
 */
export class DepositOperationException extends ApplicationException {
    /**
     * Creates an instance of DepositOperationException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "DEPOSIT_OPERATION_FAILED", 400, context);
    }
}

/**
 * Exception thrown when reset operation fails.
 *
 * @class ResetOperationException
 * @extends {ApplicationException}
 */
export class ResetOperationException extends ApplicationException {
    /**
     * Creates an instance of ResetOperationException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "RESET_OPERATION_FAILED", 400, context);
    }
} 