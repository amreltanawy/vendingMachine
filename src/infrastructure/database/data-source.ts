// src/infrastructure/database/data-source.ts
import { DataSource } from 'typeorm';
import { UserOrmEntity } from './entities/user.orm-entity';
import { UserCredentialOrmEntity } from './entities/user-credential.orm-entity';
import { ProductOrmEntity } from './entities/product.orm-entity';
import { ProductEventOrmEntity } from './entities/product-event.orm-entity';


const entities = [
    UserOrmEntity,
    UserCredentialOrmEntity,
    ProductOrmEntity,
    ProductEventOrmEntity,
];

/**
 * Production database configuration for TypeORM.
 * Used for migrations and production environment.
 */
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'vending_machine',
    entities,
    migrations: ['src/infrastructure/database/migrations/*.ts'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * Database configuration for NestJS TypeORM module.
 */
export const getDatabaseConfig = () => ({
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'vending_machine',
    entities,
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});


/**
 * Test database configuration for NestJS TypeORM module.
 */
export const getTestDatabaseConfig = () => ({
    type: 'postgres' as const,
    host: process.env.TEST_DB_HOST || 'postgres',
    port: Number(process.env.TEST_DB_PORT) || 5432,
    username: process.env.TEST_DB_USERNAME || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'password',
    database: process.env.TEST_DB_NAME || 'vending_machine_test',
    entities,
    synchronize: true, // Always synchronize for tests
    logging: false, // Disable logging for tests
    dropSchema: true, // Drop schema before each test run
});