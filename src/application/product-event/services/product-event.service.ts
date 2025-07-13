// src/application/product-event/services/product-event.service.ts
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductEventCommand } from '../commands/create-product-event.event';
import { GetProductEventsQuery } from '../queries/get-product-events.query';
import { GetProductAuditTrailQuery } from '../queries/get-product-audit-trail.query';
import { CreateProductEventDto } from '../dtos/create-product-event.dto';
import { ProductEventResponseDto } from '../dtos/product-event-response.dto';

@Injectable()
export class ProductEventApplicationService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    async createProductEvent(createdBy: string, dto: CreateProductEventDto): Promise<string> {
        const command = new CreateProductEventCommand(
            dto.productId,
            dto.eventType,
            dto.quantity,
            dto.unitPrice,
            createdBy,
            dto.description,
            dto.metadata
        );
        return await this.commandBus.execute(command);
    }

    async getProductEvents(
        productId: string,
        eventType?: 'top_up' | 'withdraw',
        limit?: number
    ): Promise<ProductEventResponseDto[]> {
        const query = new GetProductEventsQuery(productId, eventType, limit);
        return await this.queryBus.execute(query);
    }

    async getProductAuditTrail(productId: string, limit?: number): Promise<ProductEventResponseDto[]> {
        const query = new GetProductAuditTrailQuery(productId, limit);
        return await this.queryBus.execute(query);
    }

    async createTopUpEvent(
        productId: string,
        quantity: number,
        unitPrice: number,
        sellerId: string,
        description?: string
    ): Promise<string> {
        return await this.createProductEvent(sellerId, {
            productId,
            eventType: 'top_up',
            quantity,
            unitPrice,
            description: description || 'Product inventory top up'
        });
    }

    async createWithdrawEvent(
        productId: string,
        quantity: number,
        unitPrice: number,
        buyerId: string,
        purchaseOrderId?: string,
        description?: string
    ): Promise<string> {
        return await this.createProductEvent(buyerId, {
            productId,
            eventType: 'withdraw',
            quantity,
            unitPrice,
            description: description || 'Product purchased',
            metadata: { purchaseOrderId }
        });
    }
}
