// src/infrastructure/database/entities/credential.orm-entity.ts
import { Entity, PrimaryColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity('credentials')
@Unique(['userId'])
export class UserCredentialOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @OneToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 255 })
  salt: string;

  @Column({ type: 'timestamp' })
  passwordChangedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
