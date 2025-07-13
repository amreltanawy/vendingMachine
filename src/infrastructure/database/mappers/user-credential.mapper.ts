// src/infrastructure/database/mappers/user-credential.mapper.ts
import { UserCredential } from '../../../domain/user/entities/user-credential.entity';
import { UserCredentialOrmEntity } from '../entities/user-credential.orm-entity';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';

export class UserCredentialMapper {
    static toDomain(orm: UserCredentialOrmEntity): UserCredential {
        return new UserCredential(
            UserId.from(orm.userId),
            orm.passwordHash,
            orm.salt,
            orm.passwordChangedAt,
            orm.createdAt,
            orm.updatedAt
        );
    }

    static toOrm(domain: UserCredential): UserCredentialOrmEntity {
        const orm = new UserCredentialOrmEntity();
        orm.id = domain.userId.value;
        orm.userId = domain.userId.value;
        orm.passwordHash = domain.passwordHash;
        orm.salt = domain.salt;
        orm.passwordChangedAt = domain.passwordChangedAt;
        orm.updatedAt = new Date();
        return orm;
    }
}
