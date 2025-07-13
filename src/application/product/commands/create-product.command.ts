// src/application/product/commands/create-product.command.ts

import { ICommand } from '@nestjs/cqrs';

/**
 * Command to create a new product in the vending machine.
 * This command is executed by sellers to add new products to their inventory.
 * 
 * @class CreateProductCommand
 * @implements {ICommand}
 */
export class CreateProductCommand implements ICommand {
    /**
     * Creates an instance of CreateProductCommand.
     * 
     * @param {string} name - The name of the product
     * @param {number} cost - The cost of the product in cents
     * @param {number} amountAvailable - The initial amount of products available
     * @param {string} sellerId - The ID of the seller creating the product
     */
    constructor(
        public readonly name: string,
        public readonly cost: number,
        public readonly amountAvailable: number,
        public readonly sellerId: string
    ) { }
}
