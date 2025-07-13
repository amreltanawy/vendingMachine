import { Test, TestingModule } from "@nestjs/testing";
import { IdempotencyService } from "../../../../../src/application/common/services/idempotency.service";
import Redis from "ioredis";

/**
 * Unit tests for IdempotencyService.
 * Tests idempotency key validation, storage, and retrieval.
 *
 * @group unit
 * @group service
 * @group idempotency
 */
describe("IdempotencyService", () => {
    let service: IdempotencyService;
    let redis: jest.Mocked<Redis>;

    beforeEach(async () => {
        // Arrange - Setup test module with mocked Redis
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IdempotencyService,
                {
                    provide: 'default_IORedisModuleConnectionToken', // Use exact token name
                    useValue: {
                        get: jest.fn(),
                        setex: jest.fn(),
                        del: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<IdempotencyService>(IdempotencyService);
        redis = module.get('default_IORedisModuleConnectionToken');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("validateIdempotencyKey", () => {
        it("should validate correct UUID v4 format", () => {
            // Arrange
            const validKey = "550e8400-e29b-41d4-a716-446655440000";

            // Act
            const result = service.validateIdempotencyKey(validKey);

            // Assert
            expect(result).toBe(true);
        });

        it("should reject invalid UUID format", () => {
            // Arrange
            const invalidKey = "invalid-key-format";

            // Act
            const result = service.validateIdempotencyKey(invalidKey);

            // Assert
            expect(result).toBe(false);
        });

        it("should reject UUID v1 format", () => {
            // Arrange
            const uuidV1 = "550e8400-e29b-11d4-a716-446655440000"; // Note the '1' in version position

            // Act
            const result = service.validateIdempotencyKey(uuidV1);

            // Assert
            expect(result).toBe(false);
        });
    });

    describe("getProcessedResponse", () => {
        it("should return cached response when exists", async () => {
            // Arrange
            const key = "550e8400-e29b-41d4-a716-446655440000";
            const userId = "user-id";
            const cachedResponse = { data: "test response" };

            redis.get.mockResolvedValue(JSON.stringify(cachedResponse));

            // Act
            const result = await service.getProcessedResponse(key, userId);

            // Assert
            expect(result).toEqual(cachedResponse);
            expect(redis.get).toHaveBeenCalledWith(
                "idempotency:user-id:550e8400-e29b-41d4-a716-446655440000",
            );
        });

        it("should return null when no cached response exists", async () => {
            // Arrange
            const key = "550e8400-e29b-41d4-a716-446655440000";
            const userId = "user-id";

            redis.get.mockResolvedValue(null);

            // Act
            const result = await service.getProcessedResponse(key, userId);

            // Assert
            expect(result).toBeNull();
        });
    });

    describe("storeResponse", () => {
        it("should store response with default TTL", async () => {
            // Arrange
            const key = "550e8400-e29b-41d4-a716-446655440000";
            const userId = "user-id";
            const response = { data: "test response" };

            redis.setex.mockResolvedValue("OK");

            // Act
            await service.storeResponse(key, userId, response);

            // Assert
            expect(redis.setex).toHaveBeenCalledWith(
                "idempotency:user-id:550e8400-e29b-41d4-a716-446655440000",
                3600,
                JSON.stringify(response),
            );
        });

        it("should store response with custom TTL", async () => {
            // Arrange
            const key = "550e8400-e29b-41d4-a716-446655440000";
            const userId = "user-id";
            const response = { data: "test response" };
            const customTtl = 1800;

            redis.setex.mockResolvedValue("OK");

            // Act
            await service.storeResponse(key, userId, response, customTtl);

            // Assert
            expect(redis.setex).toHaveBeenCalledWith(
                "idempotency:user-id:550e8400-e29b-41d4-a716-446655440000",
                customTtl,
                JSON.stringify(response),
            );
        });
    });

    describe("removeIdempotencyKey", () => {
        it("should remove idempotency key from storage", async () => {
            // Arrange
            const key = "550e8400-e29b-41d4-a716-446655440000";
            const userId = "user-id";

            redis.del.mockResolvedValue(1);

            // Act
            await service.removeIdempotencyKey(key, userId);

            // Assert
            expect(redis.del).toHaveBeenCalledWith(
                "idempotency:user-id:550e8400-e29b-41d4-a716-446655440000",
            );
        });
    });
}); 