// src/infrastructure/database/repositories/user-credential.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserCredentialRepository } from '../../../domain/user/repositories/user-credential.irepository';
import { UserCredential } from '../../../domain/user/entities/user-credential.entity';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { UserCredentialOrmEntity } from '../entities/user-credential.orm-entity';
import { UserCredentialMapper } from '../mappers/user-credential.mapper';
import { UserCredentialException } from '../../user/exceptions/user-infrastructure.exceptions';

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
      throw new UserCredentialException('findByUserId', error);
    }
  }

  async findByUsername(username: string): Promise<UserCredential | null> {
    try {
      const ormEntity = await this.ormRepository.findOne({
        where: { user: { username } }
      });

      return ormEntity ? UserCredentialMapper.toDomain(ormEntity) : null;
    } catch (error) {
      throw new UserCredentialException('findByUsername', error);
    }
  }

  async save(credential: UserCredential): Promise<void> {
    try {
      const ormEntity = UserCredentialMapper.toOrm(credential);
      await this.ormRepository.save(ormEntity);
    } catch (error) {
      throw new UserCredentialException('save', error);
    }
  }

  async deleteByUserId(userId: UserId): Promise<void> {
    try {
      const result = await this.ormRepository.delete({ userId: userId.value });
      if (result.affected === 0) {
        throw new UserCredentialException('delete', new Error('User credentials not found'));
      }
    } catch (error) {
      throw new UserCredentialException('delete', error);
    }
  }

  async existsByUserId(userId: UserId): Promise<boolean> {
    try {
      const count = await this.ormRepository.count({
        where: { userId: userId.value }
      });
      return count > 0;
    } catch (error) {
      throw new UserCredentialException('existsByUserId', error);
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
        throw new UserCredentialException('updatePasswordHash', new Error('User credentials not found'));
      }
    } catch (error) {
      throw new UserCredentialException('updatePasswordHash', error);
    }
  }
}
