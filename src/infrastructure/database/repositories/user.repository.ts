// src/infrastructure/database/repositories/user.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/user/repositories/user.irepository';
import { User } from '../../../domain/user/entities/user.entity';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly ormRepository: Repository<UserOrmEntity>
    ) { }

    async findById(id: UserId): Promise<User | null> {
        try {
            const ormEntity = await this.ormRepository.findOne({
                where: { id: id.value }
            });

            return ormEntity ? UserMapper.toDomain(ormEntity) : null;
        } catch (error) {
            throw new Error(`Failed to find user by ID: ${error.message}`);
        }
    }

    async findByUsername(username: string): Promise<User | null> {
        try {
            const ormEntity = await this.ormRepository.findOne({
                where: { username }
            });

            return ormEntity ? UserMapper.toDomain(ormEntity) : null;
        } catch (error) {
            throw new Error(`Failed to find user by username: ${error.message}`);
        }
    }

    async save(user: User): Promise<void> {
        try {
            const ormEntity = UserMapper.toOrm(user);
            await this.ormRepository.save(ormEntity);
        } catch (error) {
            throw new Error(`Failed to save user: ${error.message}`);
        }
    }

    async delete(id: UserId): Promise<void> {
        try {
            const result = await this.ormRepository.delete({ id: id.value });
            if (result.affected === 0) {
                throw new Error('User not found');
            }
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    async existsByUsername(username: string): Promise<boolean> {
        try {
            const count = await this.ormRepository.count({
                where: { username }
            });
            return count > 0;
        } catch (error) {
            throw new Error(`Failed to check username existence: ${error.message}`);
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const ormEntities = await this.ormRepository.find({
                order: { createdAt: 'DESC' }
            });

            return ormEntities.map(entity => UserMapper.toDomain(entity));
        } catch (error) {
            throw new Error(`Failed to find all users: ${error.message}`);
        }
    }

    async count(): Promise<number> {
        try {
            return await this.ormRepository.count();
        } catch (error) {
            throw new Error(`Failed to count users: ${error.message}`);
        }
    }
}
