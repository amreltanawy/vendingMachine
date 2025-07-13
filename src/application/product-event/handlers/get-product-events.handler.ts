// src/application/product-event/handlers/get-product-events.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { GetProductEventsQuery } from '../queries/get-product-events.query';
import { IProductEventRepository } from '../../../domain/product-event/repositories/product-event.irepository';
import { ProductEventResponseDto } from '../dtos/product-event-response.dto';
import { ProductId } from '../../../domain/product/value-objects/product-id.vo';
import { ProductEventType } from '../../../domain/product-event/value-objects/product-event-type.vo';

@QueryHandler(GetProductEventsQuery)
export class GetProductEventsHandler implements IQueryHandler<GetProductEventsQuery> {
    constructor(
        private readonly productEventRepository: IProductEventRepository
    ) { }

    async execute(query: GetProductEventsQuery): Promise<ProductEventResponseDto[]> {
        if (!query.productId) {
            throw new BadRequestException('Product ID is required');
        }

        try {
            const productId = ProductId.from(query.productId);
            let events;

            if (query.eventType) {
                const eventType = ProductEventType.from(query.eventType);
                events = await this.productEventRepository.findByProductIdAndType(productId, eventType);
            } else {
                events = await this.productEventRepository.findByProductId(productId);
            }

            // Apply limit if specified
            if (query.limit && query.limit > 0) {
                events = events.slice(0, query.limit);
            }

            return events.map(event => ProductEventResponseDto.fromDomain(event));
        } catch (error) {
            throw new BadRequestException(`Failed to retrieve product events: ${error.message}`);
        }
    }
}
