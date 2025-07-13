import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IdempotencyService } from '../../application/common/services/idempotency.service';

/**
 * Interceptor that handles idempotency for HTTP requests.
 * Checks for duplicate requests and returns cached responses when appropriate.
 * 
 * @class IdempotencyInterceptor
 * @implements {NestInterceptor}
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
    /**
     * Creates an instance of IdempotencyInterceptor.
     * 
     * @param {IdempotencyService} idempotencyService - Service for handling idempotency
     */
    constructor(private readonly idempotencyService: IdempotencyService) { }

    /**
     * Intercepts the request to handle idempotency.
     * 
     * @param {ExecutionContext} context - Execution context
     * @param {CallHandler} next - Next handler in the chain
     * @returns {Observable<any>} Observable of the response
     */
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const idempotencyKey = request.headers['idempotency-key'];
        const userId = request.user?.userId;

        // Skip idempotency check if key is not provided or user is not authenticated
        if (!idempotencyKey || !userId) {
            return next.handle();
        }

        // Check for existing response
        const existingResponse = await this.idempotencyService.getProcessedResponse(
            idempotencyKey,
            userId
        );

        if (existingResponse) {
            // Return cached response for duplicate request
            return of(existingResponse.data);
        }

        // Process new request and cache the response
        return next.handle().pipe(
            tap(async (response) => {
                await this.idempotencyService.storeResponse(
                    idempotencyKey,
                    userId,
                    {
                        data: response,
                        timestamp: new Date().toISOString(),
                        method: request.method,
                        url: request.url,
                    }
                );
            })
        );
    }
} 