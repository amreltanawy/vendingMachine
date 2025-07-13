// src/infrastructure/database/entities/product-event.orm-entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('product_event')
@Index(['productId', 'createdAt'])
@Index(['eventType', 'createdAt'])
@Index(['createdBy', 'createdAt'])
export class ProductEventOrmEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column('uuid')
    @Index()
    productId: string;

    @Column({ type: 'enum', enum: ['top_up', 'withdraw'] })
    eventType: 'top_up' | 'withdraw';

    @Column('int')
    quantity: number;

    @Column('int')
    unitPrice: number;

    @Column('int')
    totalValue: number;

    @Column('uuid')
    @Index()
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column('text')
    description: string;

    @Column('json', { nullable: true })
    metadata: Record<string, any> | null;
}
