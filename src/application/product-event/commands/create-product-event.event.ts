// src/application/product-event/commands/create-product-event.command.ts
import { ICommand } from '@nestjs/cqrs';

export class CreateProductEventCommand implements ICommand {
    constructor(
        public readonly productId: string,
        public readonly eventType: 'top_up' | 'withdraw',
        public readonly quantity: number,
        public readonly unitPrice: number,
        public readonly createdBy: string,
        public readonly description: string,
        public readonly metadata?: Record<string, any>
    ) { }
}
