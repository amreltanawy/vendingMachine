import { DomainException } from "../../base/domain-exception";

/**
 * Exception thrown when user deposit operations violate business rules.
 *
 * @class UserDepositException
 * @extends {DomainException}
 */
export class UserDepositException extends DomainException {
    /**
     * Creates an instance of UserDepositException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "USER_DEPOSIT_ERROR", context);
    }
}

/**
 * Exception thrown when user role operations violate business rules.
 *
 * @class UserRoleException
 * @extends {DomainException}
 */
export class UserRoleException extends DomainException {
    /**
     * Creates an instance of UserRoleException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "USER_ROLE_ERROR", context);
    }
}


