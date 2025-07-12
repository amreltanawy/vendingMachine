// src/application/user/handlers/deposit.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DepositCommand } from '../commands/deposit.command';
import { IUserRepository } from '../../../domain/user/repositories/user.irepository';
import { Money } from '../../../domain/shared/value-objects/money.vo';

@CommandHandler(DepositCommand)
export class DepositHandler implements ICommandHandler<DepositCommand> {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(command: DepositCommand): Promise<{ totalDeposit: Money }> {
        // Validate input
        if (!command.userId || !command.amount) {
            throw new BadRequestException('User ID and amount are required');
        }

        // Find user
        const user = await this.userRepository.findById(command.userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verify user is a buyer
        if (!user.canBuyProduct()) {
            throw new ForbiddenException('Only buyers can deposit money');
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
            if (error.message.includes('Invalid coin denomination')) {
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException('Failed to process deposit');
        }
    }
}
