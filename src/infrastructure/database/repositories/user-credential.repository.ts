// src/infrastructure/database/repositories/user-credential.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserCredentialRepository } from '../../../domain/user/repositories/user-credential.irepository';
import { UserCredential } from '../../../domain/user/entities/user-credential.entity';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { UserCredentialOrmEntity } from '../entities/user-credential.orm-entity';
import { UserCredentialMapper } from '../mappers/user-credential.mapper';

@Injectable()
export class UserCredentialRepositoryImpl implements IUserCredentialRepository {
  constructor(
    @InjectRepository(UserCredentialOrmEntity)
    private readonly ormRepository: Repository<UserCredentialOrmEntity>
  ) { }

  async findByUserId(userId: UserId): Promise<UserCredential | null> {
    try {
      const ormEntity = await this.ormRepository.findOne({
        where: { userId: userId.value }
      });

      return ormEntity ? UserCredentialMapper.toDomain(ormEntity) : null;
    } catch (error) {
      throw new Error(`Failed to find credentials by user ID: ${error.message}`);
    }
  }

  async save(credential: UserCredential): Promise<void> {
    try {
      const ormEntity = UserCredentialMapper.toOrm(credential);
      await this.ormRepository.save(ormEntity);
    } catch (error) {
      throw new Error(`Failed to save user credentials: ${error.message}`);
    }
  }

  async deleteByUserId(userId: UserId): Promise<void> {
    try {
      const result = await this.ormRepository.delete({ userId: userId.value });
      if (result.affected === 0) {
        throw new Error('User credentials not found');
      }
    } catch (error) {
      throw new Error(`Failed to delete user credentials: ${error.message}`);
    }
  }

  async existsByUserId(userId: UserId): Promise<boolean> {
    try {
      const count = await this.ormRepository.count({
        where: { userId: userId.value }
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check credentials existence: ${error.message}`);
    }
  }

  async updatePasswordHash(userId: UserId, passwordHash: string): Promise<void> {
    try {
      const result = await this.ormRepository.update(
        { userId: userId.value },
        {
          passwordHash,
          passwordChangedAt: new Date()
        }
      );

      if (result.affected === 0) {
        throw new Error('User credentials not found');
      }
    } catch (error) {
      throw new Error(`Failed to update password hash: ${error.message}`);
    }
  }
}
