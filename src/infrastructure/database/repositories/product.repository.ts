// src/infrastructure/database/repositories/product.repository.impl.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { IProductRepository } from '../../../domain/product/repositories/product.irepository';
import { Product } from '../../../domain/product/entities/product.entity';
import { ProductId } from '../../../domain/product/value-objects/product-id.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ProductMapper } from '../mappers/product.mapper';

/**
 * Implementation of ProductRepository using TypeORM.
 * Provides database operations for Product entities.
 * 
 * @class ProductRepository
 * @implements {IProductRepository}
 */
@Injectable()
export class ProductRepository implements IProductRepository {
    /**
     * Creates an instance of ProductRepositoryImpl.
     * 
     * @param {Repository<ProductOrmEntity>} ormRepository - TypeORM repository for product entities
     */
    constructor(
        @InjectRepository(ProductOrmEntity)
        private readonly ormRepository: Repository<ProductOrmEntity>
    ) { }

    /**
     * Finds a product by its unique identifier.
     * 
     * @param {ProductId} id - The product ID
     * @returns {Promise<Product | null>} The product entity or null if not found
     * @throws {Error} When database operation fails
     */
    async findById(id: ProductId): Promise<Product | null> {
        try {
            const ormEntity = await this.ormRepository.findOne({
                where: { id: id.value }
            });

            return ormEntity ? ProductMapper.toDomain(ormEntity) : null;
        } catch (error) {
            throw new Error(`Failed to find product by ID: ${error.message}`);
        }
    }

    /**
     * Finds all products created by a specific seller.
     * 
     * @param {UserId} sellerId - The seller ID
     * @returns {Promise<Product[]>} Array of product entities
     * @throws {Error} When database operation fails
     */
    async findBySellerId(sellerId: UserId): Promise<Product[]> {
        try {
            const ormEntities = await this.ormRepository.find({
                where: { sellerId: sellerId.value },
                order: { createdAt: 'DESC' }
            });

            return ormEntities.map(entity => ProductMapper.toDomain(entity));
        } catch (error) {
            throw new Error(`Failed to find products by seller ID: ${error.message}`);
        }
    }

    /**
     * Find product by seller ID and name.
     * @param sellerId - Seller unique identifier
     * @param name - Product name
     * @returns Product entity or null if not found
     */
    async findBySellerIdAndName(sellerId: UserId, name: string): Promise<Product | null> {
        try {
            const ormEntity = await this.ormRepository.findOne({
                where: { sellerId: sellerId.value, name: name.toLowerCase() }
            });

            return ormEntity ? ProductMapper.toDomain(ormEntity) : null;
        } catch (error) {
            throw new Error(`Failed to find product by seller ID and name: ${error.message}`);
        }
    }

    /**
     * Finds all products in the system.
     * 
     * @returns {Promise<Product[]>} Array of all product entities
     * @throws {Error} When database operation fails
     */
    async findAll(): Promise<Product[]> {
        try {
            const ormEntities = await this.ormRepository.find({
                order: { createdAt: 'DESC' }
            });

            return ormEntities.map(entity => ProductMapper.toDomain(entity));
        } catch (error) {
            throw new Error(`Failed to find all products: ${error.message}`);
        }
    }

    /**
     * Finds products by name (case-insensitive).
     * 
     * @param {string} name - The product name to search for
     * @returns {Promise<Product[]>} Array of matching product entities
     * @throws {Error} When database operation fails
     */
    async findByName(name: string): Promise<Product[]> {
        try {
            const ormEntities = await this.ormRepository.find({
                where: { name: name.toLowerCase() },
                order: { createdAt: 'DESC' }
            });

            return ormEntities.map(entity => ProductMapper.toDomain(entity));
        } catch (error) {
            throw new Error(`Failed to find products by name: ${error.message}`);
        }
    }

    /**
     * Finds available products (amount > 0).
     * 
     * @returns {Promise<Product[]>} Array of available product entities
     * @throws {Error} When database operation fails
     */
    async findAvailable(): Promise<Product[]> {
        try {
            const ormEntities = await this.ormRepository.find({
                where: { amountAvailable: MoreThan(0) },
                order: { createdAt: 'DESC' }
            });

            return ormEntities.map(entity => ProductMapper.toDomain(entity));
        } catch (error) {
            throw new Error(`Failed to find available products: ${error.message}`);
        }
    }

    /**
     * Saves or updates a product entity.
     * 
     * @param {Product} product - The product entity to save
     * @returns {Promise<void>}
     * @throws {Error} When database operation fails
     */
    async save(product: Product): Promise<void> {
        try {
            const ormEntity = ProductMapper.toOrm(product);
            await this.ormRepository.save(ormEntity);
        } catch (error) {
            throw new Error(`Failed to save product: ${error.message}`);
        }
    }

    /**
     * Deletes a product by its ID.
     * 
     * @param {ProductId} id - The product ID
     * @returns {Promise<void>}
     * @throws {Error} When database operation fails or product not found
     */
    async delete(id: ProductId): Promise<void> {
        try {
            const result = await this.ormRepository.delete({ id: id.value });
            if (result.affected === 0) {
                throw new Error('Product not found');
            }
        } catch (error) {
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }

    /**
     * Checks if a product exists by its ID.
     * 
     * @param {ProductId} id - The product ID
     * @returns {Promise<boolean>} True if product exists, false otherwise
     * @throws {Error} When database operation fails
     */
    async existsById(id: ProductId): Promise<boolean> {
        try {
            const count = await this.ormRepository.count({
                where: { id: id.value }
            });
            return count > 0;
        } catch (error) {
            throw new Error(`Failed to check product existence: ${error.message}`);
        }
    }

    /**
     * Counts the total number of products.
     * 
     * @returns {Promise<number>} The total number of products
     * @throws {Error} When database operation fails
     */
    async count(): Promise<number> {
        try {
            return await this.ormRepository.count();
        } catch (error) {
            throw new Error(`Failed to count products: ${error.message}`);
        }
    }
}
