// src/application/product/handlers/create-product.handler.ts

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateProductCommand } from '../commands/create-product.command';
import { IProductRepository } from '../../../domain/product/repositories/product.irepository';
import { IUserRepository } from '../../../domain/user/repositories/user.irepository';
import { Product } from '../../../domain/product/entities/product.entity';
import { ProductId } from '../../../domain/product/value-objects/product-id.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { Money } from '../../../domain/shared/value-objects/money.vo';
import { ProductEventApplicationService } from '../../product-event/services/product-event.service';

/**
 * Handler for creating new products in the vending machine.
 * Validates that the seller exists and has the proper role before creating the product.
 * 
 * @class CreateProductHandler
 * @implements {ICommandHandler<CreateProductCommand>}
 */
@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
    /**
     * Creates an instance of CreateProductHandler.
     * 
     * @param {ProductRepository} productRepository - Repository for product operations
     * @param {UserRepository} userRepository - Repository for user operations
     */
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly userRepository: IUserRepository,
        private readonly productEventService: ProductEventApplicationService
    ) { }

    /**
     * Executes the create product command.
     * 
     * @param {CreateProductCommand} command - The command to execute
     * @returns {Promise<string>} The ID of the created product
     * @throws {BadRequestException} When validation fails
     * @throws {ConflictException} When product name already exists for seller
     */
    async execute(command: CreateProductCommand): Promise<string> {
        // Validate input
        if (!command.name || !command.cost || !command.sellerId) {
            throw new BadRequestException('Product name, cost, and seller ID are required');
        }

        if (command.cost <= 0) {
            throw new BadRequestException('Product cost must be greater than zero');
        }

        if (command.amountAvailable < 0) {
            throw new BadRequestException('Amount available cannot be negative');
        }

        // Verify seller exists and has proper role
        const sellerId = UserId.from(command.sellerId);
        const seller = await this.userRepository.findById(sellerId);

        if (!seller) {
            throw new BadRequestException('Seller not found');
        }

        if (!seller.canManageProducts()) {
            throw new BadRequestException('Only sellers can create products');
        }

        // Check for duplicate product name by same seller
        const duplicateProduct = await this.productRepository.findBySellerIdAndName(sellerId, command.name);

        if (duplicateProduct) {
            throw new ConflictException('Product with this name already exists for this seller');
        }

        // Create product
        const productId = ProductId.create();
        const product = Product.create(
            productId,
            command.name,
            Money.fromCents(command.cost),
            command.amountAvailable,
            sellerId
        );



        // Save product
        await this.productRepository.save(product);

        if (command.amountAvailable > 0) {
            await this.productEventService.createTopUpEvent(
                product.id.value,
                command.amountAvailable,
                product.cost.cents,
                command.sellerId,
                `Initial inventory for product: ${product.name}`
            );
        }

        // Commit events
        product.commit();

        return productId.value;
    }
}
