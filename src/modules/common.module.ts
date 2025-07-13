import { Module } from '@nestjs/common';
import { IdempotencyService } from '../application/common/services/idempotency.service';
import { IdempotencyInterceptor } from '../presentation/interceptors/idempotency.interceptor';
import { RedisModule } from './redis.module';

/**
 * Common module that provides shared services and utilities.
 * Includes idempotency service and related infrastructure.
 */
@Module({
    imports: [RedisModule],
    providers: [
        IdempotencyService,
        IdempotencyInterceptor,
    ],
    exports: [
        IdempotencyService,
        IdempotencyInterceptor,
    ],
})
export class CommonModule { } 