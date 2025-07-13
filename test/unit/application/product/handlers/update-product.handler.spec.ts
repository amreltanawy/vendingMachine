import { Test, TestingModule } from "@nestjs/testing";
import { UpdateProductHandler } from "../../../../../src/application/product/handlers/update-product.handler";
import { IProductRepository } from "../../../../../src/domain/product/repositories/product.irepository";
import { UpdateProductCommand } from "../../../../../src/application/product/commands/update-product.command";
import { Product } from "../../../../../src/domain/product/entities/product.entity";
import { ProductId } from "../../../../../src/domain/product/value-objects/product-id.vo";
import { UserId } from "../../../../../src/domain/user/value-objects/user-id.vo";
import { Money } from "../../../../../src/domain/shared/value-objects/money.vo";
import {
    ProductNotFoundException,
} from "../../../../../src/application/product/exceptions/product-application.exceptions";
import { v4 as uuidv4 } from 'uuid';

/**
 * Unit tests for UpdateProductHandler.
 * Tests product update logic, authorization, and validation.
 *
 * @group unit
 * @group application
 * @group product
 */
describe("UpdateProductHandler", () => {
    let handler: UpdateProductHandler;
    let productRepository: jest.Mocked<IProductRepository>;

    beforeEach(async () => {
        // Arrange - Setup test module
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateProductHandler,
                {
                    provide: IProductRepository,
                    useValue: {
                        findById: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        handler = module.get(UpdateProductHandler);
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
                "Original Product",
                Money.fromCents(100),
                5,
                sellerId,
            );
        });

        /**
         * Test successful product update.
         */
        it("should update product successfully", async () => {
            // Arrange
            const command = new UpdateProductCommand(
                productId.value,
                sellerId.value,
                "Updated Product",
                200,
                15,
            );
            productRepository.findById.mockResolvedValue(product);
            productRepository.save.mockResolvedValue();

            // Act
            await handler.execute(command);

            // Assert
            expect(productRepository.save).toHaveBeenCalledWith(product);
        });

        /**
         * Test partial product update.
         */
        it("should update only specified fields", async () => {
            // Arrange
            const command = new UpdateProductCommand(
                productId.value,
                sellerId.value,
                "Updated Product",
                undefined, // Cost not updated
                undefined, // Amount not updated
            );
            productRepository.findById.mockResolvedValue(product);
            productRepository.save.mockResolvedValue();

            // Act
            await handler.execute(command);

            // Assert
            expect(productRepository.save).toHaveBeenCalled();
        });

        /**
         * Test error when product not found.
         */
        it("should throw error when product not found", async () => {
            // Arrange
            const command = new UpdateProductCommand(
                uuidv4(),
                sellerId.value,
                "Updated Product",
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
            const command = new UpdateProductCommand(
                productId.value,
                otherSellerId.value,
                "Updated Product",
            );
            productRepository.findById.mockResolvedValue(product);

            // Act & Assert
            await expect(handler.execute(command)).rejects.toThrow(
                "You can only update your own products",
            );
        });
    });
}); 