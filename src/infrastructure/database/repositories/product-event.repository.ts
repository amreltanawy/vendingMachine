// src/infrastructure/database/repositories/product-event.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { IProductEventRepository } from '../../../domain/product-event/repositories/product-event.irepository';
import { ProductEvent } from '../../../domain/product-event/entities/product-event.entity';
import { ProductEventId } from '../../../domain/product-event/value-objects/product-event-id.vo';
import { ProductId } from '../../../domain/product/value-objects/product-id.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { ProductEventType } from '../../../domain/product-event/value-objects/product-event-type.vo';
import { ProductEventOrmEntity } from '../entities/product-event.orm-entity';
import { ProductEventMapper } from '../mappers/product-event.mapper';

@Injectable()
export class ProductEventRepository implements IProductEventRepository {
    constructor(
        @InjectRepository(ProductEventOrmEntity)
        private readonly ormRepository: Repository<ProductEventOrmEntity>
    ) { }

    async findById(id: ProductEventId): Promise<ProductEvent | null> {
        try {
            const ormEntity = await this.ormRepository.findOne({
                where: { id: id.value }
            });

            return ormEntity ? ProductEventMapper.toDomain(ormEntity) : null;
        } catch (error) {
            throw new Error(`Failed to find product event by ID: ${error.message}`);
        }
    }

    async findByProductId(productId: ProductId): Promise<ProductEvent[]> {
        try {
            const ormEntities = await this.ormRepository.find({
                where: { productId: productId.value },
                order: { createdAt: 'DESC' }
            });

            return ormEntities.map(entity => ProductEventMapper.toDomain(entity));
        } catch (error) {
            throw new Error(`Failed to find product events by product ID: ${error.message}`);
        }
    }

    async findByCreatedBy(userId: UserId): Promise<ProductEvent[]> {
        try {
            const ormEntities = await this.ormRepository.find({
                where: { createdBy: userId.value },
                order: { createdAt: 'DESC' }
            });

            return ormEntities.map(entity => ProductEventMapper.toDomain(entity));
        } catch (error) {
            throw new Error(`Failed to find product events by created by: ${error.message}`);
        }
    }

    async findByProductIdAndType(productId: ProductId, eventType: ProductEventType): Promise<ProductEvent[]> {
        try {
            const ormEntities = await this.ormRepository.find({
                where: {
                    productId: productId.value,
                    eventType: eventType.value
                },
                order: { createdAt: 'DESC' }
            });

            return ormEntities.map(entity => ProductEventMapper.toDomain(entity));
        } catch (error) {
            throw new Error(`Failed to find product events by product ID and type: ${error.message}`);
        }
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<ProductEvent[]> {
        try {
            const ormEntities = await this.ormRepository.find({
                where: {
                    createdAt: Between(startDate, endDate)
                },
                order: { createdAt: 'DESC' }
            });

            return ormEntities.map(entity => ProductEventMapper.toDomain(entity));
        } catch (error) {
            throw new Error(`Failed to find product events by date range: ${error.message}`);
        }
    }

    async save(productEvent: ProductEvent): Promise<void> {
        try {
            const ormEntity = ProductEventMapper.toOrm(productEvent);
            await this.ormRepository.save(ormEntity);
        } catch (error) {
            throw new Error(`Failed to save product event: ${error.message}`);
        }
    }

    async delete(id: ProductEventId): Promise<void> {
        try {
            const result = await this.ormRepository.delete({ id: id.value });
            if (result.affected === 0) {
                throw new Error('Product event not found');
            }
        } catch (error) {
            throw new Error(`Failed to delete product event: ${error.message}`);
        }
    }

    async count(): Promise<number> {
        try {
            return await this.ormRepository.count();
        } catch (error) {
            throw new Error(`Failed to count product events: ${error.message}`);
        }
    }

    async getInventoryHistory(productId: ProductId): Promise<ProductEvent[]> {
        try {
            const ormEntities = await this.ormRepository.find({
                where: { productId: productId.value },
                order: { createdAt: 'ASC' }
            });

            return ormEntities.map(entity => ProductEventMapper.toDomain(entity));
        } catch (error) {
            throw new Error(`Failed to get inventory history: ${error.message}`);
        }
    }

    async getAuditTrail(productId: ProductId, limit?: number): Promise<ProductEvent[]> {
        try {
            const query = this.ormRepository.createQueryBuilder('event')
                .where('event.productId = :productId', { productId: productId.value })
                .orderBy('event.createdAt', 'DESC');

            if (limit && limit > 0) {
                query.limit(limit);
            }

            const ormEntities = await query.getMany();
            return ormEntities.map(entity => ProductEventMapper.toDomain(entity));
        } catch (error) {
            throw new Error(`Failed to get audit trail: ${error.message}`);
        }
    }
}
