import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '../src/presentation/middleware/exception-handler.middleware';


// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.TEST_DB_HOST = process.env.TEST_DB_HOST || 'localhost';
process.env.TEST_DB_PORT = process.env.TEST_DB_PORT || '5432';
process.env.TEST_DB_USERNAME = process.env.TEST_DB_USERNAME || 'postgres';
process.env.TEST_DB_PASSWORD = process.env.TEST_DB_PASSWORD || 'password';
process.env.TEST_DB_NAME = process.env.TEST_DB_NAME || 'vending_machine_test';

console.log('Test environment configured with database:', {
    host: process.env.TEST_DB_HOST,
    port: process.env.TEST_DB_PORT,
    username: process.env.TEST_DB_USERNAME,
    database: process.env.TEST_DB_NAME,
});

// Configure Jest timeout
jest.setTimeout(30000);

// Global test application instance
let app: INestApplication;

// Setup function to initialize the test application
export async function setupTestApp(): Promise<INestApplication> {
    const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same middleware as in main.ts
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));

    await app.init();
    return app;
}

// Cleanup function to close the test application
export async function cleanupTestApp(): Promise<void> {
    if (app) {
        await app.close();
    }
}

// Global cleanup
afterAll(async () => {
    await cleanupTestApp();
});

// Test database helper utilities
export const testDbHelpers = {
    async clearDatabase(): Promise<void> {
        // Implementation depends on the database setup
        // This will be implemented when creating specific e2e tests
    },

    async seedDatabase(): Promise<void> {
        // Implementation for seeding test data
        // This will be implemented when creating specific e2e tests
    }
};

// Test user factory for authentication
export const testUserFactory = {
    createBuyer: () => ({
        username: 'testbuyer',
        password: 'password123',
        role: 'buyer' as const,
    }),

    createSeller: () => ({
        username: 'testseller',
        password: 'password123',
        role: 'seller' as const,
    }),
};

// JWT token helper for authenticated requests
export const authHelpers = {
    async getAuthToken(app: INestApplication, userCredentials: any): Promise<string> {
        // Implementation will be added when creating auth tests
        return 'test-jwt-token';
    },
}; 