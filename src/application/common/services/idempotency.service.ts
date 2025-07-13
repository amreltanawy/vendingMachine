import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

/**
 * Service for handling idempotency keys to prevent duplicate request processing.
 * Uses Redis for distributed caching and request deduplication.
 *
 * @class IdempotencyService
 */
@Injectable()
export class IdempotencyService {
    private readonly IDEMPOTENCY_KEY_PREFIX = "idempotency:";
    private readonly DEFAULT_TTL = 3600; // 1 hour in seconds

    /**
     * Creates an instance of IdempotencyService.
     *
     * @param {Redis} redis - Redis client for caching
     */
    constructor(@InjectRedis() private readonly redis: Redis) { }

    /**
     * Checks if an idempotency key has been processed before.
     *
     * @param {string} key - The idempotency key
     * @param {string} userId - User ID to scope the key
     * @returns {Promise<any>} Previous response if exists, null otherwise
     */
    async getProcessedResponse(key: string, userId: string): Promise<any> {
        const redisKey = this.buildRedisKey(key, userId);
        const cachedResponse = await this.redis.get(redisKey);

        if (cachedResponse) {
            return JSON.parse(cachedResponse);
        }

        return null;
    }

    /**
     * Stores the response for an idempotency key.
     *
     * @param {string} key - The idempotency key
     * @param {string} userId - User ID to scope the key
     * @param {any} response - The response to cache
     * @param {number} [ttl] - Time to live in seconds
     * @returns {Promise<void>}
     */
    async storeResponse(
        key: string,
        userId: string,
        response: any,
        ttl: number = this.DEFAULT_TTL,
    ): Promise<void> {
        const redisKey = this.buildRedisKey(key, userId);
        await this.redis.setex(redisKey, ttl, JSON.stringify(response));
    }

    /**
     * Validates the format of an idempotency key.
     *
     * @param {string} key - The idempotency key to validate
     * @returns {boolean} True if valid, false otherwise
     */
    validateIdempotencyKey(key: string): boolean {
        // UUID v4 format validation
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(key);
    }

    /**
     * Builds a Redis key for idempotency storage.
     *
     * @private
     * @param {string} key - The idempotency key
     * @param {string} userId - User ID to scope the key
     * @returns {string} The Redis key
     */
    private buildRedisKey(key: string, userId: string): string {
        return `${this.IDEMPOTENCY_KEY_PREFIX}${userId}:${key}`;
    }

    /**
     * Removes an idempotency key from storage.
     *
     * @param {string} key - The idempotency key
     * @param {string} userId - User ID to scope the key
     * @returns {Promise<void>}
     */
    async removeIdempotencyKey(key: string, userId: string): Promise<void> {
        const redisKey = this.buildRedisKey(key, userId);
        await this.redis.del(redisKey);
    }
} 