import { Test, TestingModule } from "@nestjs/testing";
import { CreateProductEventHandler } from "../../../../../src/application/product-event/handlers/create-product-event.handler";
import { IProductEventRepository } from "../../../../../src/domain/product-event/repositories/product-event.irepository";
import { CreateProductEventCommand } from "../../../../../src/application/product-event/commands/create-product-event.event";
import { ProductEvent } from "../../../../../src/domain/product-event/entities/product-event.entity";
import { ProductEventId } from "../../../../../src/domain/product-event/value-objects/product-event-id.vo";
import { ProductId } from "../../../../../src/domain/product/value-objects/product-id.vo";
import { UserId } from "../../../../../src/domain/user/value-objects/user-id.vo";
import { BadRequestException } from "@nestjs/common";

/**
 * Unit tests for CreateProductEventHandler.
 * Tests product event creation logic, validation, and error scenarios.
 *
 * @group unit
 * @group application
 * @group product-event
 */
describe("CreateProductEventHandler", () => {
    let handler: CreateProductEventHandler;
    let productEventRepository: jest.Mocked<IProductEventRepository>;

    beforeEach(async () => {
        // Arrange - Setup test module
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateProductEventHandler,
                {
                    provide: IProductEventRepository,
                    useValue: {
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        handler = module.get(CreateProductEventHandler);
        productEventRepository = module.get(IProductEventRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        /**
         * Test successful product event creation.
         */
        it("should create product event successfully", async () => {
            // Arrange
            const productId = ProductId.create();
            const createdBy = UserId.create();
            const command = new CreateProductEventCommand(
                productId.value,
                "top_up",
                10,
                100,
                createdBy.value,
                "Restocking product",
                { batchNumber: "BATCH001" }
            );

            productEventRepository.save.mockResolvedValue();

            // Act
            const result = await handler.execute(command);

            // Assert
            expect(result).toBeDefined();
            expect(productEventRepository.save).toHaveBeenCalled();
        });

        /**
         * Test withdraw event creation.
         */
        it("should create withdraw event successfully", async () => {
            // Arrange
            const productId = ProductId.create();
            const createdBy = UserId.create();
            const command = new CreateProductEventCommand(
                productId.value,
                "withdraw",
                5,
                100,
                createdBy.value,
                "Product sold",
                { orderId: "ORDER123" }
            );

            productEventRepository.save.mockResolvedValue();

            // Act
            const result = await handler.execute(command);

            // Assert
            expect(result).toBeDefined();
            expect(productEventRepository.save).toHaveBeenCalled();
        });

        /**
         * Test error when product ID is missing.
         */
        it("should throw error when product ID is missing", async () => {
            // Arrange
            const command = new CreateProductEventCommand(
                "",
                "top_up",
                10,
                100,
                "user-id",
                "Description"
            );

            // Act & Assert
            await expect(handler.execute(command)).rejects.toThrow(
                BadRequestException,
            );
        });

        /**
         * Test error when event type is missing.
         */
        it("should throw error when event type is missing", async () => {
            // Arrange
            const command = new CreateProductEventCommand(
                "product-id",
                "" as any,
                10,
                100,
                "user-id",
                "Description"
            );

            // Act & Assert
            await expect(handler.execute(command)).rejects.toThrow(
                BadRequestException,
            );
        });

        /**
         * Test error when quantity is missing.
         */
        it("should throw error when quantity is missing", async () => {
            // Arrange
            const command = new CreateProductEventCommand(
                "product-id",
                "top_up",
                0,
                100,
                "user-id",
                "Description"
            );

            // Act & Assert
            await expect(handler.execute(command)).rejects.toThrow(
                BadRequestException,
            );
        });

        /**
         * Test error when created by is missing.
         */
        it("should throw error when created by is missing", async () => {
            // Arrange
            const command = new CreateProductEventCommand(
                "product-id",
                "top_up",
                10,
                100,
                "",
                "Description"
            );

            // Act & Assert
            await expect(handler.execute(command)).rejects.toThrow(
                BadRequestException,
            );
        });

        /**
         * Test event creation with minimal data.
         */
        it("should create event with minimal required data", async () => {
            // Arrange
            const productId = ProductId.create();
            const createdBy = UserId.create();
            const command = new CreateProductEventCommand(
                productId.value,
                "top_up",
                1,
                50,
                createdBy.value,
                "Minimal event"
            );

            productEventRepository.save.mockResolvedValue();

            // Act
            const result = await handler.execute(command);

            // Assert
            expect(result).toBeDefined();
            expect(productEventRepository.save).toHaveBeenCalled();
        });

        /**
         * Test error handling when repository save fails.
         */
        it("should handle repository save failure", async () => {
            // Arrange
            const productId = ProductId.create();
            const createdBy = UserId.create();
            const command = new CreateProductEventCommand(
                productId.value,
                "top_up",
                10,
                100,
                createdBy.value,
                "Description"
            );

            productEventRepository.save.mockRejectedValue(new Error("Database error"));

            // Act & Assert
            await expect(handler.execute(command)).rejects.toThrow(
                BadRequestException,
            );
        });
    });
}); 