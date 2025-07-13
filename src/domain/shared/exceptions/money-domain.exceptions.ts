import { DomainException } from "../../base/domain-exception";

/**
 * Exception thrown when money value operations violate business rules.
 *
 * @class InvalidMoneyValueException
 * @extends {DomainException}
 */
export class InvalidMoneyValueException extends DomainException {
    /**
     * Creates an instance of InvalidMoneyValueException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "INVALID_MONEY_VALUE", context);
    }
}

/**
 * Exception thrown when invalid coin denominations are used.
 *
 * @class InvalidCoinDenominationException
 * @extends {DomainException}
 */
export class InvalidCoinDenominationException extends DomainException {
    /**
     * Creates an instance of InvalidCoinDenominationException.
     *
     * @param {number} denomination - The invalid denomination
     * @param {number[]} validDenominations - List of valid denominations
     */
    constructor(denomination: number, validDenominations: number[]) {
        super(
            `Invalid coin denomination: ${denomination}. Valid denominations: ${validDenominations.join(", ")}`,
            "INVALID_COIN_DENOMINATION",
            { denomination, validDenominations },
        );
    }
}

/**
 * Exception thrown when insufficient funds operations are attempted.
 *
 * @class InsufficientFundsException
 * @extends {DomainException}
 */
export class InsufficientFundsException extends DomainException {
    /**
     * Creates an instance of InsufficientFundsException.
     *
     * @param {number} available - Available funds in cents
     * @param {number} required - Required funds in cents
     */
    constructor(available: number, required: number) {
        super(
            `Insufficient funds. Available: ${available} cents, Required: ${required} cents`,
            "INSUFFICIENT_FUNDS",
            { available, required },
        );
    }
} 