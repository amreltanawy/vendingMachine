import { Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';

/**
 * Redis module configuration for idempotency and caching.
 * Provides Redis connection throughout the application.
 */
@Module({
    imports: [
        NestRedisModule.forRoot({
            type: 'single',
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            options: {
                maxRetriesPerRequest: 3,
                lazyConnect: true,
                connectTimeout: 10000,
                commandTimeout: 5000,
            },
        }),
    ],
    exports: [NestRedisModule],
})
export class RedisModule { } 