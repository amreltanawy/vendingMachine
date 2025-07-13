// src/application/product/handlers/delete-product.handler.ts

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { DeleteProductCommand } from '../commands/delete-product.command';
import { IProductRepository } from '../../../domain/product/repositories/product.irepository';
import { ProductId } from '../../../domain/product/value-objects/product-id.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { ProductNotFoundException, ProductDeletionException } from '../exceptions/product-application.exceptions';

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
     * @throws {ProductNotFoundException} When product is not found
     * @throws {ForbiddenException} When seller doesn't own the product
     * @throws {ProductDeletionException} When deletion fails
     */
    async execute(command: DeleteProductCommand): Promise<void> {
        // Validate input
        if (!command.productId || !command.sellerId) {
            throw new BadRequestException('Product ID and seller ID are required');
        }

        try {
            // Find product
            const productId = ProductId.from(command.productId);
            const sellerId = UserId.from(command.sellerId);
            const product = await this.productRepository.findById(productId);

            if (!product) {
                throw new ProductNotFoundException(command.productId);
            }

            // Verify seller owns the product
            if (!product.canBeUpdatedBy(sellerId)) {
                throw new ForbiddenException('You can only delete your own products');
            }

            // Delete product
            await this.productRepository.delete(productId);
        } catch (error) {
            // Re-throw known application exceptions
            if (error instanceof ProductNotFoundException ||
                error instanceof BadRequestException ||
                error instanceof ForbiddenException) {
                throw error;
            }

            // Wrap repository errors
            throw new ProductDeletionException(`Failed to delete product: ${error.message}`);
        }
    }
}
