// src/infrastructure/database/mappers/product.mapper.ts

import { Product } from '../../../domain/product/entities/product.entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ProductId } from '../../../domain/product/value-objects/product-id.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { Money } from '../../../domain/shared/value-objects/money.vo';

/**
 * Mapper class for converting between Product domain entities and ORM entities.
 * Handles the transformation between domain layer and persistence layer.
 * 
 * @class ProductMapper
 */
export class ProductMapper {
    /**
     * Converts a ProductOrmEntity to a Product domain entity.
     * 
     * @param {ProductOrmEntity} orm - The ORM entity
     * @returns {Product} The domain entity
     */
    static toDomain(orm: ProductOrmEntity): Product {
        return Product.create(
            ProductId.from(orm.id),
            orm.name,
            Money.fromCents(orm.cost),
            orm.amountAvailable,
            UserId.from(orm.sellerId),
            orm.createdAt,
            orm.updatedAt
        );
    }

    /**
     * Converts a Product domain entity to a ProductOrmEntity.
     * 
     * @param {Product} domain - The domain entity
     * @returns {ProductOrmEntity} The ORM entity
     */
    static toOrm(domain: Product): ProductOrmEntity {
        const orm = new ProductOrmEntity();
        orm.id = domain.id.value;
        orm.name = domain.name;
        orm.cost = domain.cost.cents;
        orm.amountAvailable = domain.amountAvailable;
        orm.sellerId = domain.sellerId.value;
        orm.createdAt = domain.createdAt || new Date();
        orm.updatedAt = domain.updatedAt || new Date();
        return orm;
    }
}
