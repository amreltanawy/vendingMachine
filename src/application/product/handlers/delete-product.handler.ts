// src/application/product/handlers/delete-product.handler.ts

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
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
    private readonly logger = new Logger(DeleteProductHandler.name);

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
        this.logger.log(`Starting product deletion process`, {
            productId: command.productId,
            sellerId: command.sellerId,
            timestamp: new Date().toISOString()
        });

        // Validate input
        if (!command.productId || !command.sellerId) {
            this.logger.error(`Product deletion failed: Missing required parameters`, {
                productId: command.productId,
                sellerId: command.sellerId
            });
            throw new BadRequestException('Product ID and seller ID are required');
        }

        this.logger.debug(`Input validation passed`, {
            productId: command.productId,
            sellerId: command.sellerId
        });

        try {
            // Find product
            const productId = ProductId.from(command.productId);
            const sellerId = UserId.from(command.sellerId);

            this.logger.debug(`Looking up product`, {
                productId: productId.value,
                sellerId: sellerId.value
            });

            const product = await this.productRepository.findById(productId);

            if (!product) {
                this.logger.warn(`Product not found during deletion attempt`, {
                    productId: command.productId,
                    sellerId: command.sellerId
                });
                throw new ProductNotFoundException(command.productId);
            }

            this.logger.debug(`Product found`, {
                productId: product.id.value,
                productName: product.name,
                currentSellerId: product.sellerId.value,
                requestingSellerId: sellerId.value
            });

            // Verify seller owns the product
            if (!product.canBeUpdatedBy(sellerId)) {
                this.logger.warn(`Unauthorized product deletion attempt`, {
                    productId: product.id.value,
                    productName: product.name,
                    productOwnerId: product.sellerId.value,
                    requestingSellerId: sellerId.value
                });
                throw new ForbiddenException('You can only delete your own products');
            }

            this.logger.debug(`Authorization check passed`, {
                productId: product.id.value,
                sellerId: sellerId.value
            });

            // Delete product
            await this.productRepository.delete(productId);

            this.logger.log(`Product successfully deleted`, {
                productId: product.id.value,
                productName: product.name,
                sellerId: sellerId.value,
                deletedAt: new Date().toISOString()
            });

        } catch (error) {
            // Log the error with context
            this.logger.error(`Product deletion failed`, {
                productId: command.productId,
                sellerId: command.sellerId,
                error: error.message,
                errorType: error.constructor.name,
                stack: error.stack
            });

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
