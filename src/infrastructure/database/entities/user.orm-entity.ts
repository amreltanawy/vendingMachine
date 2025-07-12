// src/infrastructure/database/entities/user.orm-entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('user')
export class UserOrmEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ default: 0 })
    deposit: number;

    @Column({ type: 'enum', enum: ['buyer', 'seller'] })
    role: 'buyer' | 'seller';

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
