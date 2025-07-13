// src/application/product-event/handlers/create-product-event.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { CreateProductEventCommand } from '../commands/create-product-event.event';
import { IProductEventRepository } from '../../../domain/product-event/repositories/product-event.irepository';
import { ProductEvent } from '../../../domain/product-event/entities/product-event.entity';
import { ProductEventId } from '../../../domain/product-event/value-objects/product-event-id.vo';
import { ProductId } from '../../../domain/product/value-objects/product-id.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { ProductEventType } from '../../../domain/product-event/value-objects/product-event-type.vo';
import { Money } from '../../../domain/shared/value-objects/money.vo';

@CommandHandler(CreateProductEventCommand)
export class CreateProductEventHandler implements ICommandHandler<CreateProductEventCommand> {
    constructor(
        private readonly productEventRepository: IProductEventRepository
    ) { }

    async execute(command: CreateProductEventCommand): Promise<string> {
        if (!command.productId || !command.eventType || !command.quantity || !command.createdBy) {
            throw new BadRequestException('Product ID, event type, quantity, and created by are required');
        }

        try {
            const productEvent = ProductEvent.create(
                ProductEventId.create(),
                ProductId.from(command.productId),
                ProductEventType.from(command.eventType),
                command.quantity,
                Money.fromCents(command.unitPrice),
                UserId.from(command.createdBy),
                command.description,
                command.metadata
            );

            await this.productEventRepository.save(productEvent);
            productEvent.commit();

            return productEvent.id.value;
        } catch (error) {
            throw new BadRequestException(`Failed to create product event: ${error.message}`);
        }
    }
}
