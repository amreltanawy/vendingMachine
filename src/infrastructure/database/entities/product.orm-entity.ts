// src/infrastructure/database/entities/product.orm-entity.ts

import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * TypeORM entity representing a product in the vending machine.
 * Maps to the 'products' table in the database.
 * 
 * @class ProductOrmEntity
 */
@Entity('product')
@Index(['sellerId', 'createdAt'])
@Index(['name', 'sellerId'])
export class ProductOrmEntity {
    /**
     * Unique identifier for the product.
     * 
     * @type {string}
     */
    @PrimaryColumn('uuid')
    id: string;

    /**
     * Name of the product.
     * 
     * @type {string}
     */
    @Column({ length: 100 })
    @Index()
    name: string;

    /**
     * Cost of the product in cents.
     * 
     * @type {number}
     */
    @Column('int')
    cost: number;

    /**
     * Number of products available for purchase.
     * 
     * @type {number}
     */
    @Column('int')
    amountAvailable: number;

    /**
     * ID of the seller who created this product.
     * 
     * @type {string}
     */
    @Column('uuid')
    @Index()
    sellerId: string;

    /**
     * Timestamp when the product was created.
     * 
     * @type {Date}
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * Timestamp when the product was last updated.
     * 
     * @type {Date}
     */
    @UpdateDateColumn()
    updatedAt: Date;
}
