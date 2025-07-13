// src/application/product/handlers/purchase-product.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PurchaseProductCommand } from '../commands/purchase-product.command';
import { IUserRepository } from '../../../domain/user/repositories/user.irepository';
import { IProductRepository } from '../../../domain/product/repositories/product.irepository';
import { ChangeCalculatorService } from '../../../domain/vending-machine/service/change-calculator.service';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { ProductId } from '../../../domain/product/value-objects/product-id.vo';
import { Money } from '../../../domain/shared/value-objects/money.vo';
import { PurchaseResult } from '../dtos/purchase-result.dto';
import { ProductEventApplicationService } from '../../product-event/services/product-event.service';

@CommandHandler(PurchaseProductCommand)
export class PurchaseProductHandler implements ICommandHandler<PurchaseProductCommand> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly productRepository: IProductRepository,
        private readonly changeCalculator: ChangeCalculatorService,
        private readonly productEventService: ProductEventApplicationService
    ) { }

    async execute(command: PurchaseProductCommand): Promise<PurchaseResult> {
        const userId = UserId.from(command.userId);
        const productId = ProductId.from(command.productId);

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (!user.canBuyProduct()) {
            throw new Error('Only buyers can purchase products');
        }

        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (!product.isAvailable()) {
            throw new Error('Product is not available');
        }

        const totalCost = Money.fromCents(product.cost.cents * command.quantity);

        if (user.deposit.isLessThan(totalCost)) {
            throw new Error('Insufficient funds');
        }

        // Execute the purchase
        product.purchase(command.quantity);
        user.spendMoney(totalCost);


        // Calculate change
        const change = this.changeCalculator.calculateChange(user.deposit);
        user.resetDeposit();

        // Save changes
        await this.userRepository.save(user);
        await this.productRepository.save(product);

        // Record product event for audit trail
        await this.productEventService.createWithdrawEvent(
            product.id.value,
            command.quantity,
            product.cost.cents,
            user.id.value,
            undefined, // purchaseOrderId if available
            `Product purchased by ${user.username}`
        );

        return new PurchaseResult(
            totalCost.cents,
            [{ name: product.name, quantity: command.quantity }],
            change
        );
    }
}
