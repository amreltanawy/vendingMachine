// src/application/product/handlers/update-product.handler.ts

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UpdateProductCommand } from '../commands/update-product.command';
import { IProductRepository } from '../../../domain/product/repositories/product.irepository';
import { ProductId } from '../../../domain/product/value-objects/product-id.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { Money } from '../../../domain/shared/value-objects/money.vo';
import { ProductNotFoundException, ProductUpdateException } from '../exceptions/product-application.exceptions';

/**
 * Handler for updating existing products in the vending machine.
 * Only the seller who created the product can update it.
 * 
 * @class UpdateProductHandler
 * @implements {ICommandHandler<UpdateProductCommand>}
 */
@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
    /**
     * Creates an instance of UpdateProductHandler.
     * 
     * @param {IProductRepository} productRepository - Repository for product operations
     */
    constructor(private readonly productRepository: IProductRepository) { }

    /**
     * Executes the update product command.
     * 
     * @param {UpdateProductCommand} command - The command to execute
     * @returns {Promise<void>}
     * @throws {BadRequestException} When validation fails
     * @throws {ProductNotFoundException} When product is not found
     * @throws {ForbiddenException} When seller doesn't own the product
     * @throws {ProductUpdateException} When update fails
     */
    async execute(command: UpdateProductCommand): Promise<void> {
        // Validate input
        if (!command.productId || !command.sellerId) {
            throw new BadRequestException('Product ID and seller ID are required');
        }

        if (command.cost !== undefined && command.cost <= 0) {
            throw new BadRequestException('Product cost must be greater than zero');
        }

        if (command.amountAvailable !== undefined && command.amountAvailable < 0) {
            throw new BadRequestException('Amount available cannot be negative');
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
                throw new ForbiddenException('You can only update your own products');
            }

            // Update product fields
            if (command.name) {
                product.updateName(command.name);
            }

            if (command.cost !== undefined) {
                product.updateCost(Money.fromCents(command.cost));
            }

            if (command.amountAvailable !== undefined) {
                product.updateAmount(command.amountAvailable);
            }

            // Save updated product
            await this.productRepository.save(product);

            // Commit events
            product.commit();
        } catch (error) {
            // Re-throw known application exceptions
            if (error instanceof ProductNotFoundException ||
                error instanceof BadRequestException ||
                error instanceof ForbiddenException) {
                throw error;
            }

            // Handle UUID validation errors
            if (error.message.includes('Invalid UUID')) {
                throw new BadRequestException('Invalid product ID format');
            }

            // Wrap unexpected errors
            throw new ProductUpdateException(`Failed to update product: ${error.message}`);
        }
    }
}
