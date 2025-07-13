// src/infrastructure/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig, getTestDatabaseConfig } from '../infrastructure/database/data-source';

/**
 * Database module that provides TypeORM configuration.
 * Switches between production and test configurations based on environment.
 */
@Module({
    imports: [
        TypeOrmModule.forRoot(
            process.env.NODE_ENV === 'test'
                ? getTestDatabaseConfig()
                : getDatabaseConfig()
        ),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }