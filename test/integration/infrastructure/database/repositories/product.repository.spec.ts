import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ProductRepository } from "../../../../../src/infrastructure/database/repositories/product.repository";
import { ProductOrmEntity } from "../../../../../src/infrastructure/database/entities/product.orm-entity";
import { Product } from "../../../../../src/domain/product/entities/product.entity";
import { ProductId } from "../../../../../src/domain/product/value-objects/product-id.vo";
import { UserId } from "../../../../../src/domain/user/value-objects/user-id.vo";
import { Money } from "../../../../../src/domain/shared/value-objects/money.vo";
import { DatabaseModule } from "../../../../../src/modules/database.module";
import { ProductEventOrmEntity } from "../../../../../src/infrastructure/database/entities/product-event.orm-entity";
import { UserCredentialOrmEntity } from "../../../../../src/infrastructure/database/entities/user-credential.orm-entity";

/**
 * Integration tests for ProductRepository.
 * Tests database operations and data persistence.
 *
 * @group integration
 * @group infrastructure
 * @group product
 */
describe("ProductRepository Integration", () => {
    let repository: ProductRepository;
    let dataSource: DataSource;
    let module: TestingModule;

    beforeAll(async () => {
        // Arrange - Setup test database
        module = await Test.createTestingModule({
            imports: [
                DatabaseModule,
                TypeOrmModule.forFeature([ProductOrmEntity]),
            ],
            providers: [ProductRepository],
        }).compile();

        repository = module.get(ProductRepository);
        dataSource = module.get(DataSource);
    });

    afterAll(async () => {
        await dataSource.destroy();
        await module.close();
    });

    afterEach(async () => {
        // Clean database before each test
        await dataSource.getRepository(ProductEventOrmEntity).clear();
        await dataSource.getRepository(ProductOrmEntity).clear();
        await dataSource.getRepository(UserCredentialOrmEntity).clear();
    });

    describe("save and findById", () => {
        /**
         * Test successful product save and retrieval.
         */
        it("should save and retrieve product", async () => {
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

            // Act
            await repository.save(product);
            const retrievedProduct = await repository.findById(productId);

            // Assert
            expect(retrievedProduct).not.toBeNull();
            expect(retrievedProduct!.id.value).toBe(productId.value);
            expect(retrievedProduct!.name).toBe("Test Product");
            expect(retrievedProduct!.cost.cents).toBe(150);
            expect(retrievedProduct!.amountAvailable).toBe(10);
            expect(retrievedProduct!.sellerId.value).toBe(sellerId.value);
        });

        /**
         * Test product not found returns null.
         */
        it("should return null when product not found", async () => {
            // Arrange
            const nonExistentId = ProductId.create();

            // Act
            const result = await repository.findById(nonExistentId);

            // Assert
            expect(result).toBeNull();
        });

        /**
         * Test updating existing product.
         */
        it("should update existing product", async () => {
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
            await repository.save(product);

            // Modify product
            product.updateAmount(20);

            // Act
            await repository.save(product);
            const retrievedProduct = await repository.findById(productId);

            // Assert
            expect(retrievedProduct!.amountAvailable).toBe(20);
        });
    });

    describe("findBySellerId", () => {
        /**
         * Test finding products by seller ID.
         */
        it("should find products by seller ID", async () => {
            // Arrange
            const sellerId = UserId.create();
            const product1 = Product.create(
                ProductId.create(),
                "Product 1",
                Money.fromCents(100),
                5,
                sellerId,
            );
            const product2 = Product.create(
                ProductId.create(),
                "Product 2",
                Money.fromCents(200),
                3,
                sellerId,
            );
            await repository.save(product1);
            await repository.save(product2);

            // Act
            const products = await repository.findBySellerId(sellerId);

            // Assert
            expect(products).toHaveLength(2);
            expect(products.map((p) => p.name)).toEqual(
                expect.arrayContaining(["Product 1", "Product 2"]),
            );
        });

        /**
         * Test empty result when seller has no products.
         */
        it("should return empty array when seller has no products", async () => {
            // Arrange
            const sellerId = UserId.create();

            // Act
            const products = await repository.findBySellerId(sellerId);

            // Assert
            expect(products).toHaveLength(0);
        });

        /**
         * Test filtering by specific seller.
         */
        it("should filter products by specific seller", async () => {
            // Arrange
            const seller1Id = UserId.create();
            const seller2Id = UserId.create();
            const product1 = Product.create(
                ProductId.create(),
                "Product 1",
                Money.fromCents(100),
                5,
                seller1Id,
            );
            const product2 = Product.create(
                ProductId.create(),
                "Product 2",
                Money.fromCents(200),
                3,
                seller2Id,
            );
            await repository.save(product1);
            await repository.save(product2);

            // Act
            const seller1Products = await repository.findBySellerId(seller1Id);

            // Assert
            expect(seller1Products).toHaveLength(1);
            expect(seller1Products[0].name).toBe("Product 1");
        });
    });

    describe("findAll", () => {
        /**
         * Test retrieving all products.
         */
        it("should retrieve all products", async () => {
            // Arrange
            const sellerId = UserId.create();
            const product1 = Product.create(
                ProductId.create(),
                "Product 1",
                Money.fromCents(100),
                5,
                sellerId,
            );
            const product2 = Product.create(
                ProductId.create(),
                "Product 2",
                Money.fromCents(200),
                3,
                sellerId,
            );
            await repository.save(product1);
            await repository.save(product2);

            // Act
            const products = await repository.findAll();

            // Assert
            expect(products).toHaveLength(2);
        });

        /**
         * Test empty result when no products exist.
         */
        it("should return empty array when no products exist", async () => {
            // Act
            const products = await repository.findAll();

            // Assert
            expect(products).toHaveLength(0);
        });
    });

    describe("delete", () => {
        /**
         * Test successful product deletion.
         */
        it("should delete product successfully", async () => {
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
            await repository.save(product);

            // Act
            await repository.delete(productId);
            const retrievedProduct = await repository.findById(productId);

            // Assert
            expect(retrievedProduct).toBeNull();
        });

        /**
         * Test error when deleting non-existent product.
         */
        it("should throw error when deleting non-existent product", async () => {
            // Arrange
            const nonExistentId = ProductId.create();

            // Act & Assert
            await expect(repository.delete(nonExistentId)).rejects.toThrow(
                "Product not found",
            );
        });
    });

    describe("existsById", () => {
        /**
         * Test product existence check.
         */
        it("should return true when product exists", async () => {
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
            await repository.save(product);

            // Act
            const exists = await repository.existsById(productId);

            // Assert
            expect(exists).toBe(true);
        });

        /**
         * Test product non-existence check.
         */
        it("should return false when product does not exist", async () => {
            // Arrange
            const nonExistentId = ProductId.create();

            // Act
            const exists = await repository.existsById(nonExistentId);

            // Assert
            expect(exists).toBe(false);
        });
    });

    describe("count", () => {
        /**
         * Test product count.
         */
        it("should count products correctly", async () => {
            // Arrange
            const sellerId = UserId.create();
            const product1 = Product.create(
                ProductId.create(),
                "Product 1",
                Money.fromCents(100),
                5,
                sellerId,
            );
            const product2 = Product.create(
                ProductId.create(),
                "Product 2",
                Money.fromCents(200),
                3,
                sellerId,
            );
            await repository.save(product1);
            await repository.save(product2);

            // Act
            const count = await repository.count();

            // Assert
            expect(count).toBe(2);
        });

        /**
         * Test zero count when no products exist.
         */
        it("should return zero when no products exist", async () => {
            // Act
            const count = await repository.count();

            // Assert
            expect(count).toBe(0);
        });
    });
}); 