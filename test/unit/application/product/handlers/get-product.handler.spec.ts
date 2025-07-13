import { Test, TestingModule } from "@nestjs/testing";
import { GetProductHandler } from "../../../../../src/application/product/handlers/get-product.handler";
import { IProductRepository } from "../../../../../src/domain/product/repositories/product.irepository";
import { GetProductQuery } from "../../../../../src/application/product/queries/get-product.query";
import { Product } from "../../../../../src/domain/product/entities/product.entity";
import { ProductId } from "../../../../../src/domain/product/value-objects/product-id.vo";
import { UserId } from "../../../../../src/domain/user/value-objects/user-id.vo";
import { Money } from "../../../../../src/domain/shared/value-objects/money.vo";
import { ProductNotFoundException } from "../../../../../src/application/product/exceptions/product-application.exceptions";
import { v4 as uuidv4 } from 'uuid';

/**
 * Unit tests for GetProductHandler.
 * Tests query handling logic and error scenarios.
 *
 * @group unit
 * @group application
 * @group product
 */
describe("GetProductHandler", () => {
    let handler: GetProductHandler;
    let productRepository: jest.Mocked<IProductRepository>;

    beforeEach(async () => {
        // Arrange - Setup test module
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetProductHandler,
                {
                    provide: IProductRepository,
                    useValue: {
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        handler = module.get(GetProductHandler);
        productRepository = module.get(IProductRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        /**
         * Test successful product retrieval.
         */
        it("should return product data when product exists", async () => {
            // Arrange
            const productId = ProductId.create();
            const sellerId = UserId.create();
            const product = Product.create(
                productId,
                "Test Product",
                Money.fromCents(150),
                10,
                sellerId,
            );
            const query = new GetProductQuery(productId.value);

            productRepository.findById.mockResolvedValue(product);

            // Act
            const result = await handler.execute(query);

            // Assert
            expect(result).toBeDefined();
            expect(result.id).toBe(productId.value);
            expect(result.name).toBe("Test Product");
            expect(result.cost).toBe(150);
            expect(result.amountAvailable).toBe(10);
            expect(result.sellerId).toBe(sellerId.value);
        });

        /**
         * Test error when product not found.
         */
        it("should throw error when product not found", async () => {
            // Arrange
            const query = new GetProductQuery(uuidv4());
            productRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(handler.execute(query)).rejects.toThrow(
                ProductNotFoundException,
            );
        });

        /**
         * Test validation of required fields.
         */
        it("should throw error when product ID is missing", async () => {
            // Arrange
            const query = new GetProductQuery("");

            // Act & Assert
            await expect(handler.execute(query)).rejects.toThrow(
                "Product ID is required",
            );
        });

        /**
         * Test error with invalid UUID format.
         */
        it("should throw error when product ID has invalid format", async () => {
            // Arrange
            const query = new GetProductQuery("invalid-uuid");

            // Act & Assert
            await expect(handler.execute(query)).rejects.toThrow(
                "Invalid product ID format",
            );
        });

        /**
         * Test product with zero availability.
         */
        it("should return product with zero availability", async () => {
            // Arrange
            const productId = ProductId.create();
            const sellerId = UserId.create();
            const product = Product.create(
                productId,
                "Out of Stock Product",
                Money.fromCents(100),
                0,
                sellerId,
            );
            const query = new GetProductQuery(productId.value);

            productRepository.findById.mockResolvedValue(product);

            // Act
            const result = await handler.execute(query);

            // Assert
            expect(result.amountAvailable).toBe(0);
        });
    });
}); 