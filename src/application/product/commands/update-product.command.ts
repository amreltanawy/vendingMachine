// src/application/product/commands/update-product.command.ts

import { ICommand } from '@nestjs/cqrs';

/**
 * Command to update an existing product in the vending machine.
 * Only the seller who created the product can update it.
 * 
 * @class UpdateProductCommand
 * @implements {ICommand}
 */
export class UpdateProductCommand implements ICommand {
    /**
     * Creates an instance of UpdateProductCommand.
     * 
     * @param {string} productId - The ID of the product to update
     * @param {string} sellerId - The ID of the seller updating the product
     * @param {string} [name] - Optional new name for the product
     * @param {number} [cost] - Optional new cost for the product in cents
     * @param {number} [amountAvailable] - Optional new amount available
     */
    constructor(
        public readonly productId: string,
        public readonly sellerId: string,
        public readonly name?: string,
        public readonly cost?: number,
        public readonly amountAvailable?: number
    ) { }
}
