import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { DomainException } from "../../domain/base/domain-exception";
import { ApplicationException } from "../../application/base/application-exception";
import { InfrastructureException } from "../../infrastructure/base/infrastructure-exception";

/**
 * Global exception filter that handles all exceptions in the application.
 * Provides consistent error response format and logging.
 *
 * @class GlobalExceptionFilter
 * @implements {ExceptionFilter}
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    /**
     * Handles exceptions and returns appropriate HTTP responses.
     *
     * @param {unknown} exception - The exception to handle
     * @param {ArgumentsHost} host - The arguments host
     */
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const errorResponse = this.buildErrorResponse(exception, request);

        // Log the error
        this.logError(exception, request, errorResponse);

        response.status(errorResponse.statusCode).json(errorResponse);
    }

    /**
     * Builds a standardized error response.
     *
     * @private
     * @param {unknown} exception - The exception
     * @param {Request} request - The HTTP request
     * @returns {object} The error response
     */
    private buildErrorResponse(exception: unknown, request: Request) {
        const timestamp = new Date().toISOString();
        const path = request.url;
        const method = request.method;

        if (exception instanceof ApplicationException) {
            return {
                statusCode: exception.httpStatus,
                timestamp,
                path,
                method,
                error: exception.constructor.name,
                code: exception.code,
                message: exception.message,
                context: exception.context,
            };
        }

        if (exception instanceof DomainException) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                timestamp,
                path,
                method,
                error: exception.constructor.name,
                code: exception.code,
                message: exception.message,
                context: exception.context,
            };
        }

        if (exception instanceof InfrastructureException) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                timestamp,
                path,
                method,
                error: exception.constructor.name,
                code: exception.code,
                message: "Internal server error",
                context: exception.context,
            };
        }

        if (exception instanceof HttpException) {
            return {
                statusCode: exception.getStatus(),
                timestamp,
                path,
                method,
                error: exception.constructor.name,
                code: "HTTP_EXCEPTION",
                message: exception.message,
            };
        }

        // Unknown exception
        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp,
            path,
            method,
            error: "UnknownException",
            code: "UNKNOWN_ERROR",
            message: "An unexpected error occurred",
        };
    }

    /**
     * Logs the error with appropriate level.
     *
     * @private
     * @param {unknown} exception - The exception
     * @param {Request} request - The HTTP request
     * @param {object} errorResponse - The error response
     */
    private logError(exception: unknown, request: Request, errorResponse: any) {
        const logMessage =
            `${request.method} ${request.url} - ${errorResponse.statusCode} - ${errorResponse.message}`;

        if (exception instanceof InfrastructureException) {
            this.logger.error(logMessage, exception.stack);
        } else if (exception instanceof ApplicationException) {
            this.logger.warn(logMessage);
        } else if (exception instanceof DomainException) {
            this.logger.warn(logMessage);
        } else {
            this.logger.error(
                logMessage,
                exception instanceof Error ? exception.stack : "Unknown error",
            );
        }
    }
} 