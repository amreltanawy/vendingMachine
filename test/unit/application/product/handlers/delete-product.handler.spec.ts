import { Test, TestingModule } from "@nestjs/testing";
import { DeleteProductHandler } from "../../../../../src/application/product/handlers/delete-product.handler";
import { IProductRepository } from "../../../../../src/domain/product/repositories/product.irepository";
import { DeleteProductCommand } from "../../../../../src/application/product/commands/delete-product.command";
import { Product } from "../../../../../src/domain/product/entities/product.entity";
import { ProductId } from "../../../../../src/domain/product/value-objects/product-id.vo";
import { UserId } from "../../../../../src/domain/user/value-objects/user-id.vo";
import { Money } from "../../../../../src/domain/shared/value-objects/money.vo";
import {
    ProductNotFoundException,
    ProductDeletionException,
} from "../../../../../src/application/product/exceptions/product-application.exceptions";
import { v4 as uuidv4 } from 'uuid';
/**
 * Unit tests for DeleteProductHandler.
 * Tests product deletion logic, authorization, and validation.
 *
 * @group unit
 * @group application
 * @group product
 */
describe("DeleteProductHandler", () => {
    let handler: DeleteProductHandler;
    let productRepository: jest.Mocked<IProductRepository>;

    beforeEach(async () => {
        // Arrange - Setup test module
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DeleteProductHandler,
                {
                    provide: IProductRepository,
                    useValue: {
                        findById: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        handler = module.get(DeleteProductHandler);
        productRepository = module.get(IProductRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        let product: Product;
        let productId: ProductId;
        let sellerId: UserId;

        beforeEach(() => {
            productId = ProductId.create();
            sellerId = UserId.create();
            product = Product.create(
                productId,
                "Test Product",
                Money.fromCents(100),
                5,
                sellerId,
            );
        });

        /**
         * Test successful product deletion.
         */
        it("should delete product successfully", async () => {
            // Arrange
            const command = new DeleteProductCommand(
                productId.value,
                sellerId.value,
            );
            productRepository.findById.mockResolvedValue(product);
            productRepository.delete.mockResolvedValue();

            // Act
            await handler.execute(command);

            // Assert
            expect(productRepository.delete).toHaveBeenCalledWith(productId);
        });

        /**
         * Test error when product not found.
         */
        it("should throw error when product not found", async () => {
            // Arrange
            const command = new DeleteProductCommand(
                uuidv4(),
                sellerId.value,
            );
            productRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(handler.execute(command)).rejects.toThrow(
                ProductNotFoundException,
            );
        });

        /**
         * Test error when seller doesn't own product.
         */
        it("should throw error when seller does not own product", async () => {
            // Arrange
            const otherSellerId = UserId.create();
            const command = new DeleteProductCommand(
                productId.value,
                otherSellerId.value,
            );
            productRepository.findById.mockResolvedValue(product);

            // Act & Assert
            await expect(handler.execute(command)).rejects.toThrow(
                "You can only delete your own products",
            );
        });

        /**
         * Test validation of required fields.
         */
        it("should throw error when required fields are missing", async () => {
            // Arrange
            const command = new DeleteProductCommand("", sellerId.value);

            // Act & Assert
            await expect(handler.execute(command)).rejects.toThrow(
                "Product ID and seller ID are required",
            );
        });

        /**
         * Test error handling when repository delete fails.
         */
        it("should handle repository delete failure", async () => {
            // Arrange
            const command = new DeleteProductCommand(
                productId.value,
                sellerId.value,
            );
            productRepository.findById.mockResolvedValue(product);
            productRepository.delete.mockRejectedValue(new Error("Database error"));

            // Act & Assert
            await expect(handler.execute(command)).rejects.toThrow(
                "Failed to delete product",
            );
        });
    });
}); 