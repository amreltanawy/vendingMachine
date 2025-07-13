// src/application/user/handlers/deposit.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DepositCommand } from '../commands/deposit.command';
import { IUserRepository } from '../../../domain/user/repositories/user.irepository';
import { Money } from '../../../domain/shared/value-objects/money.vo';
import { UserNotFoundException, UserAuthorizationException } from '../exceptions/user-application.exceptions';
import { DepositOperationException } from '../../vending-machine/exceptions/vending-machine-application.exceptions';
import { DomainException } from '../../../domain/base/domain-exception';

@CommandHandler(DepositCommand)
export class DepositHandler implements ICommandHandler<DepositCommand> {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(command: DepositCommand): Promise<{ totalDeposit: Money }> {
        // Validate input
        if (!command.userId || !command.amount) {
            throw new DepositOperationException('User ID and amount are required');
        }

        // Find user
        const user = await this.userRepository.findById(command.userId);

        if (!user) {
            throw new UserNotFoundException(command.userId.value);
        }

        // Verify user is a buyer
        if (!user.canBuyProduct()) {
            throw new UserAuthorizationException('deposit money', user.role.value);
        }

        try {
            // Create money value object with denomination validation
            const depositAmount = Money.fromValidDenomination(command.amount);

            // Add deposit to user account
            user.addDeposit(depositAmount);

            // Save user with updated deposit
            await this.userRepository.save(user);
            return {
                totalDeposit: user.deposit
            };
        } catch (error) {
            if (error instanceof UserNotFoundException ||
                error instanceof UserAuthorizationException ||
                error instanceof DepositOperationException) {
                throw error;
            }

            if (error instanceof DomainException) {
                throw new DepositOperationException(error.message, { originalError: error });
            }

            throw new DepositOperationException('Failed to process deposit', { originalError: error.message });
        }
    }
}
