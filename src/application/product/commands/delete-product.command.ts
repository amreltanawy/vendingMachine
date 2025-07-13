// src/application/product/commands/delete-product.command.ts

import { ICommand } from '@nestjs/cqrs';

/**
 * Command to delete a product from the vending machine.
 * Only the seller who created the product can delete it.
 * 
 * @class DeleteProductCommand
 * @implements {ICommand}
 */
export class DeleteProductCommand implements ICommand {
    /**
     * Creates an instance of DeleteProductCommand.
     * 
     * @param {string} productId - The ID of the product to delete
     * @param {string} sellerId - The ID of the seller deleting the product
     */
    constructor(
        public readonly productId: string,
        public readonly sellerId: string
    ) { }
}
