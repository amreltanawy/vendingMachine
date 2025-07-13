import { DomainException } from "../../domain/base/domain-exception";
import { ApplicationException } from "../../application/base/application-exception";
import { InfrastructureException } from "../../infrastructure/base/infrastructure-exception";

/**
 * Factory for creating standardized exceptions across the application.
 * Provides consistent error creation and categorization.
 *
 * @class ExceptionFactory
 */
export class ExceptionFactory {
    /**
     * Creates a domain exception with standardized format.
     *
     * @param {string} message - The error message
     * @param {string} code - The error code
     * @param {any} [context] - Additional context information
     * @returns {DomainException} The domain exception
     */
    static createDomainException(
        message: string,
        code: string,
        context?: any,
    ): DomainException {
        return new (class extends DomainException {
            constructor() {
                super(message, code, context);
            }
        })();
    }

    /**
     * Creates an application exception with standardized format.
     *
     * @param {string} message - The error message
     * @param {string} code - The error code
     * @param {number} httpStatus - HTTP status code
     * @param {any} [context] - Additional context information
     * @returns {ApplicationException} The application exception
     */
    static createApplicationException(
        message: string,
        code: string,
        httpStatus: number,
        context?: any,
    ): ApplicationException {
        return new (class extends ApplicationException {
            constructor() {
                super(message, code, httpStatus, context);
            }
        })();
    }

    /**
     * Creates an infrastructure exception with standardized format.
     *
     * @param {string} message - The error message
     * @param {string} code - The error code
     * @param {Error} [cause] - The underlying cause
     * @param {any} [context] - Additional context information
     * @returns {InfrastructureException} The infrastructure exception
     */
    static createInfrastructureException(
        message: string,
        code: string,
        cause?: Error,
        context?: any,
    ): InfrastructureException {
        return new (class extends InfrastructureException {
            constructor() {
                super(message, code, cause, context);
            }
        })();
    }
} 