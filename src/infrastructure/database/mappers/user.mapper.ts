// src/infrastructure/database/mappers/user.mapper.ts
import { User } from '../../../domain/user/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { UserRole } from '../../../domain/user/value-objects/user-role.vo';
import { Money } from '../../../domain/shared/value-objects/money.vo';

export class UserMapper {
    static toDomain(orm: UserOrmEntity): User {
        return User.create(
            UserId.from(orm.id),
            orm.username,
            UserRole.from(orm.role),
            Money.fromCents(orm.deposit),
            orm.createdAt,
            orm.updatedAt
        );
    }

    static toOrm(domain: User): UserOrmEntity {
        const orm = new UserOrmEntity();
        orm.id = domain.id.value;
        orm.username = domain.username;
        orm.role = domain.role.value;
        orm.deposit = domain.deposit.cents;
        orm.createdAt = domain.createdAt || new Date();
        orm.updatedAt = domain.updatedAt || new Date();
        return orm;
    }
}
