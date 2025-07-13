import {
    BadRequestException,
    createParamDecorator,
    ExecutionContext,
} from "@nestjs/common";

/**
 * Decorator to extract and validate idempotency key from request headers.
 *
 * @param {any} data - Optional data parameter
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} The validated idempotency key
 * @throws {BadRequestException} When idempotency key is missing or invalid
 */
export const IdempotencyKey = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        const idempotencyKey = request.headers["idempotency-key"];

        if (!idempotencyKey) {
            throw new BadRequestException(
                "Idempotency-Key header is required for this operation",
            );
        }

        if (typeof idempotencyKey !== "string") {
            throw new BadRequestException("Idempotency-Key must be a string");
        }

        // Validate UUID format
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(idempotencyKey)) {
            throw new BadRequestException(
                "Idempotency-Key must be a valid UUID v4",
            );
        }

        return idempotencyKey;
    },
); 