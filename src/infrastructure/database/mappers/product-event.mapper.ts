// src/infrastructure/database/mappers/product-event.mapper.ts
import { ProductEvent } from '../../../domain/product-event/entities/product-event.entity';
import { ProductEventOrmEntity } from '../entities/product-event.orm-entity';
import { ProductEventId } from '../../../domain/product-event/value-objects/product-event-id.vo';
import { ProductId } from '../../../domain/product/value-objects/product-id.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { ProductEventType } from '../../../domain/product-event/value-objects/product-event-type.vo';
import { Money } from '../../../domain/shared/value-objects/money.vo';

export class ProductEventMapper {
    static toDomain(orm: ProductEventOrmEntity): ProductEvent {
        return ProductEvent.create(
            ProductEventId.from(orm.id),
            ProductId.from(orm.productId),
            ProductEventType.from(orm.eventType),
            orm.quantity,
            Money.fromCents(orm.unitPrice),
            UserId.from(orm.createdBy),
            orm.description,
            orm.metadata || undefined
        );
    }

    static toOrm(domain: ProductEvent): ProductEventOrmEntity {
        const orm = new ProductEventOrmEntity();
        orm.id = domain.id.value;
        orm.productId = domain.productId.value;
        orm.eventType = domain.eventType.value;
        orm.quantity = domain.quantity;
        orm.unitPrice = domain.unitPrice.cents;
        orm.totalValue = domain.totalValue.cents;
        orm.createdBy = domain.createdBy.value;
        orm.createdAt = domain.createdAt;
        orm.description = domain.description;
        orm.metadata = domain.metadata || null;
        return orm;
    }
}
