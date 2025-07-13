import { ApplicationException } from "../../base/application-exception";

/**
 * Exception thrown when user creation fails due to validation errors.
 *
 * @class UserCreationException
 * @extends {ApplicationException}
 */
export class UserCreationException extends ApplicationException {
    /**
     * Creates an instance of UserCreationException.
     *
     * @param {string} message - The error message
     * @param {any} [context] - Additional context information
     */
    constructor(message: string, context?: any) {
        super(message, "USER_CREATION_FAILED", 400, context);
    }
}

/**
 * Exception thrown when username already exists.
 *
 * @class UsernameAlreadyExistsException
 * @extends {ApplicationException}
 */
export class UsernameAlreadyExistsException extends ApplicationException {
    /**
     * Creates an instance of UsernameAlreadyExistsException.
     *
     * @param {string} username - The conflicting username
     */
    constructor(username: string) {
        super(
            `Username '${username}' already exists`,
            "USERNAME_ALREADY_EXISTS",
            409,
            { username },
        );
    }
}

/**
 * Exception thrown when user is not found.
 *
 * @class UserNotFoundException
 * @extends {ApplicationException}
 */
export class UserNotFoundException extends ApplicationException {
    /**
     * Creates an instance of UserNotFoundException.
     *
     * @param {string} identifier - The user identifier (ID or username)
     */
    constructor(identifier: string) {
        super(
            `User not found: ${identifier}`,
            "USER_NOT_FOUND",
            404,
            { identifier },
        );
    }
}

/**
 * Exception thrown when user authentication fails.
 *
 * @class UserAuthenticationException
 * @extends {ApplicationException}
 */
export class UserAuthenticationException extends ApplicationException {
    /**
     * Creates an instance of UserAuthenticationException.
     *
     * @param {string} message - The error message
     */
    constructor(message: string = "Authentication failed") {
        super(message, "USER_AUTHENTICATION_FAILED", 401);
    }
}

/**
 * Exception thrown when user authorization fails.
 *
 * @class UserAuthorizationException
 * @extends {ApplicationException}
 */
export class UserAuthorizationException extends ApplicationException {
    /**
     * Creates an instance of UserAuthorizationException.
     *
     * @param {string} action - The action being attempted
     * @param {string} role - The user's role
     */
    constructor(action: string, role: string) {
        super(
            `User with role '${role}' is not authorized to perform action: ${action}`,
            "USER_AUTHORIZATION_FAILED",
            403,
            { action, role },
        );
    }
} 