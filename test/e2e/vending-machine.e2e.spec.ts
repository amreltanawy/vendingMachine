import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { IdempotencyService } from '../../src/application/common/services/idempotency.service';

/**
 * End-to-end tests for vending machine API workflows.
 * Tests complete user journeys including authentication, product management, and purchases.
 *
 * @group e2e
 * @group api
 * @group workflows
 */
describe('Vending Machine API (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let buyerToken: string;
    let sellerToken: string;
    let buyerId: string;
    let sellerId: string;
    let productId: string;

    beforeAll(async () => {
        // Arrange - Setup test application with mocked IdempotencyService
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(IdempotencyService)
            .useValue({
                getProcessedResponse: jest.fn().mockResolvedValue(null),
                storeResponse: jest.fn().mockResolvedValue(undefined),
                validateIdempotencyKey: jest.fn().mockReturnValue(true),
                removeIdempotencyKey: jest.fn().mockResolvedValue(undefined),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        dataSource = moduleFixture.get<DataSource>(DataSource);

        // Wait for database to be ready
        console.log('Waiting for database connection...');
        await dataSource.query('SELECT 1');
        console.log('Database connection established');
    });

    afterAll(async () => {
        // Improved cleanup with proper error handling
        try {
            if (dataSource) {
                await dataSource.destroy();
            }
        } catch (error) {
            console.error('Error closing database connection:', error);
        }

        try {
            if (app) {
                await app.close();
            }
        } catch (error) {
            console.error('Error closing application:', error);
        }
    });

    beforeEach(async () => {
        // Clean database and setup test users
        if (dataSource) {
            try {
                console.log('Synchronizing database...');
                await dataSource.synchronize(true);
                console.log('Database synchronized');

                console.log('Setting up test users...');
                await setupTestUsers();
                console.log('Test users setup completed');
            } catch (error) {
                console.error('Error in beforeEach:', error);
                throw error;
            }
        }
    });

    async function setupTestUsers() {
        try {
            // Create buyer user
            console.log('Creating buyer user...');
            const buyerResponse = await request(app.getHttpServer())
                .post('/users')
                .send({
                    username: 'buyer_user',
                    password: 'password123',
                    role: 'buyer'
                });

            console.log('Buyer response status:', buyerResponse.status);
            console.log('Buyer response body:', buyerResponse.body);

            if (buyerResponse.status !== 201) {
                throw new Error(`Failed to create buyer user: ${buyerResponse.status} - ${JSON.stringify(buyerResponse.body)}`);
            }

            buyerId = buyerResponse.body.id;

            // Login buyer - removed idempotency key
            const buyerLoginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    username: 'buyer_user',
                    password: 'password123'
                })
                .expect(200);

            buyerToken = buyerLoginResponse.body.access_token;

            // Create seller user
            const sellerResponse = await request(app.getHttpServer())
                .post('/users')
                .set('Idempotency-Key', uuidv4())
                .send({
                    username: 'seller_user',
                    password: 'password123',
                    role: 'seller'
                });

            console.log('Seller response status:', sellerResponse.status);
            console.log('Seller response body:', sellerResponse.body);

            if (sellerResponse.status !== 201) {
                throw new Error(`Failed to create seller user: ${sellerResponse.status} - ${JSON.stringify(sellerResponse.body)}`);
            }

            sellerId = sellerResponse.body.id;

            // Login seller - removed idempotency key
            const sellerLoginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    username: 'seller_user',
                    password: 'password123'
                })
                .expect(200);

            sellerToken = sellerLoginResponse.body.access_token;
        } catch (error) {
            console.error('Error in setupTestUsers:', error);
            throw error;
        }
    }

    describe('Complete Vending Machine Workflow', () => {
        /**
         * Test complete purchase workflow from product creation to purchase.
         */
        it('should complete full purchase workflow', async () => {
            // Step 1: Seller creates a product
            const productResponse = await request(app.getHttpServer())
                .post('/products')
                .set('Authorization', `Bearer ${sellerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    name: 'Test Soda',
                    cost: 150,
                    amountAvailable: 10
                })
                .expect(201);

            productId = productResponse.body.id;
            expect(productResponse.body.message).toBe('Product created successfully');

            // Step 2: Buyer deposits money
            await request(app.getHttpServer())
                .post('/users/deposit')
                .set('Authorization', `Bearer ${buyerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    amount: 200
                })
                .expect(200);

            // Step 3: Buyer purchases product
            const purchaseResponse = await request(app.getHttpServer())
                .post('/products/buy')
                .set('Authorization', `Bearer ${buyerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    productId: productId,
                    quantity: 1
                })
                .expect(200);

            // Assert purchase result
            expect(purchaseResponse.body).toBeDefined();
            expect(purchaseResponse.body.totalSpent).toBe(150);
            expect(purchaseResponse.body.products).toHaveLength(1);
            expect(purchaseResponse.body.change).toBeDefined();
        });

        /**
         * Test idempotency for duplicate requests.
         */
        it('should handle duplicate product creation with idempotency', async () => {
            // Arrange
            const idempotencyKey = uuidv4();
            const productData = {
                name: 'Duplicate Test Product',
                cost: 100,
                amountAvailable: 5
            };

            // Act - Make first request
            const firstResponse = await request(app.getHttpServer())
                .post('/products')
                .set('Authorization', `Bearer ${sellerToken}`)
                .set('Idempotency-Key', idempotencyKey)
                .send(productData)
                .expect(201);

            // Act - Make duplicate request with same idempotency key
            const secondResponse = await request(app.getHttpServer())
                .post('/products')
                .set('Authorization', `Bearer ${sellerToken}`)
                .set('Idempotency-Key', idempotencyKey)
                .send(productData)
                .expect(201);

            // Assert - Both responses should be identical
            expect(firstResponse.body.id).toBe(secondResponse.body.id);
            expect(firstResponse.body.message).toBe(secondResponse.body.message);
        });

        /**
         * Test insufficient funds scenario.
         */
        it('should handle insufficient funds gracefully', async () => {
            // Step 1: Create expensive product
            const productResponse = await request(app.getHttpServer())
                .post('/products')
                .set('Authorization', `Bearer ${sellerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    name: 'Expensive Item',
                    cost: 500,
                    amountAvailable: 1
                })
                .expect(201);

            productId = productResponse.body.id;

            // Step 2: Buyer deposits insufficient amount
            await request(app.getHttpServer())
                .post('/users/deposit')
                .set('Authorization', `Bearer ${buyerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    amount: 100
                })
                .expect(200);

            // Step 3: Attempt purchase with insufficient funds
            await request(app.getHttpServer())
                .post('/buy')
                .set('Authorization', `Bearer ${buyerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    productId: productId,
                    quantity: 1
                })
                .expect(400);
        });

        /**
         * Test product out of stock scenario.
         */
        it('should handle out of stock products', async () => {
            // Step 1: Create product with limited stock
            const productResponse = await request(app.getHttpServer())
                .post('/products')
                .set('Authorization', `Bearer ${sellerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    name: 'Limited Stock Item',
                    cost: 100,
                    amountAvailable: 1
                })
                .expect(201);

            productId = productResponse.body.id;

            // Step 2: Buyer deposits money
            await request(app.getHttpServer())
                .post('/users/deposit')
                .set('Authorization', `Bearer ${buyerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    amount: 300
                })
                .expect(200);

            // Step 3: Attempt to buy more than available
            await request(app.getHttpServer())
                .post('/buy')
                .set('Authorization', `Bearer ${buyerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    productId: productId,
                    quantity: 2
                })
                .expect(400);
        });
    });

    describe('Authentication and Authorization', () => {
        /**
         * Test unauthorized access is rejected.
         */
        it('should reject unauthorized requests', async () => {
            await request(app.getHttpServer())
                .post('/products')
                .set('Idempotency-Key', uuidv4())
                .send({
                    name: 'Unauthorized Product',
                    cost: 100,
                    amountAvailable: 1
                })
                .expect(401);
        });

        /**
         * Test role-based access control.
         */
        it('should enforce role-based access control', async () => {
            // Buyer cannot create products
            await request(app.getHttpServer())
                .post('/products')
                .set('Authorization', `Bearer ${buyerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    name: 'Buyer Product',
                    cost: 100,
                    amountAvailable: 1
                })
                .expect(403);

            // Seller cannot buy products
            await request(app.getHttpServer())
                .post('/buy')
                .set('Authorization', `Bearer ${sellerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    productId: 'some-id',
                    quantity: 1
                })
                .expect(403);
        });
    });

    describe('Product Management', () => {
        /**
         * Test complete product CRUD operations.
         */
        it('should support complete product CRUD operations', async () => {
            // Create
            const createResponse = await request(app.getHttpServer())
                .post('/products')
                .set('Authorization', `Bearer ${sellerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    name: 'CRUD Test Product',
                    cost: 200,
                    amountAvailable: 5
                })
                .expect(201);

            productId = createResponse.body.id;

            // Read
            const getResponse = await request(app.getHttpServer())
                .get(`/products/${productId}`)
                .expect(200);

            expect(getResponse.body.name).toBe('CRUD Test Product');
            expect(getResponse.body.cost).toBe(200);

            // Update
            await request(app.getHttpServer())
                .put(`/products/${productId}`)
                .set('Authorization', `Bearer ${sellerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    name: 'Updated Product',
                    cost: 250,
                    amountAvailable: 8
                })
                .expect(200);

            // Verify update
            const updatedResponse = await request(app.getHttpServer())
                .get(`/products/${productId}`)
                .expect(200);

            expect(updatedResponse.body.name).toBe('Updated Product');
            expect(updatedResponse.body.cost).toBe(250);

            // Delete
            await request(app.getHttpServer())
                .delete(`/products/${productId}`)
                .set('Authorization', `Bearer ${sellerToken}`)
                .set('Idempotency-Key', uuidv4())
                .expect(204);

            // Verify deletion
            await request(app.getHttpServer())
                .get(`/products/${productId}`)
                .expect(404);
        });
    });

    describe('Deposit Management', () => {
        /**
         * Test deposit and reset functionality.
         */
        it('should handle deposit and reset operations', async () => {
            // Deposit
            await request(app.getHttpServer())
                .post('/users/deposit')
                .set('Authorization', `Bearer ${buyerToken}`)
                .set('Idempotency-Key', uuidv4())
                .send({
                    amount: 100
                })
                .expect(201);

            // Verify deposit
            const userResponse = await request(app.getHttpServer())
                .get(`/users/${buyerId}`)
                .set('Authorization', `Bearer ${buyerToken}`)
                .expect(200);

            expect(userResponse.body.deposit).toBe(100);

            // Reset deposit
            const resetResponse = await request(app.getHttpServer())
                .post('/users/reset')
                .set('Authorization', `Bearer ${buyerToken}`)
                .set('Idempotency-Key', uuidv4())
                .expect(200);

            expect(resetResponse.body.message).toBe('Deposit reset successful');
            expect(resetResponse.body.change).toBeDefined();
        });
    });
}); 