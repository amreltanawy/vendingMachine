// src/application/vending-machine/commands/purchase-product.command.ts
import { ICommand } from '@nestjs/cqrs';

export class PurchaseProductCommand implements ICommand {
    constructor(
        public readonly userId: string,
        public readonly productId: string,
        public readonly quantity: number
    ) { }
}
