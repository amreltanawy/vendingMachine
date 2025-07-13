// src/application/product/handlers/delete-product.handler.ts

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DeleteProductCommand } from '../commands/delete-product.command';
import { IProductRepository } from '../../../domain/product/repositories/product.irepository';
import { ProductId } from '../../../domain/product/value-objects/product-id.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';

/**
 * Handler for deleting products from the vending machine.
 * Only the seller who created the product can delete it.
 * 
 * @class DeleteProductHandler
 * @implements {ICommandHandler<DeleteProductCommand>}
 */
@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
    /**
     * Creates an instance of DeleteProductHandler.
     * 
     * @param {IProductRepository} productRepository - Repository for product operations
     */
    constructor(private readonly productRepository: IProductRepository) { }

    /**
     * Executes the delete product command.
     * 
     * @param {DeleteProductCommand} command - The command to execute
     * @returns {Promise<void>}
     * @throws {BadRequestException} When validation fails
     * @throws {NotFoundException} When product is not found
     * @throws {ForbiddenException} When seller doesn't own the product
     */
    async execute(command: DeleteProductCommand): Promise<void> {
        // Validate input
        if (!command.productId || !command.sellerId) {
            throw new BadRequestException('Product ID and seller ID are required');
        }

        // Find product
        const productId = ProductId.from(command.productId);
        const sellerId = UserId.from(command.sellerId);
        const product = await this.productRepository.findById(productId);

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Verify seller owns the product
        if (!product.canBeUpdatedBy(sellerId)) {
            throw new ForbiddenException('You can only delete your own products');
        }

        // Delete product
        await this.productRepository.delete(productId);
    }
}
