// src/application/user/handlers/reset-deposit.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ResetDepositCommand } from '../commands/reset-deposit.command';
import { IUserRepository } from '../../../domain/user/repositories/user.irepository';
import { Money } from '../../../domain/shared/value-objects/money.vo';

export interface ResetDepositResult {
    totalReturned: Money;
}

@CommandHandler(ResetDepositCommand)
export class ResetDepositHandler implements ICommandHandler<ResetDepositCommand> {
    constructor(
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(command: ResetDepositCommand): Promise<ResetDepositResult> {
        // Validate input
        if (!command.userId) {
            throw new BadRequestException('User ID is required');
        }

        // Find user
        const user = await this.userRepository.findById(command.userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verify user is a buyer
        if (!user.canBuyProduct()) {
            throw new ForbiddenException('Only buyers can reset deposit');
        }

        const currentDeposit = user.deposit;

        try {
            // Reset user deposit
            user.resetDeposit();

            // Save user with reset deposit
            await this.userRepository.save(user);

            return {
                totalReturned: currentDeposit
            };
        } catch (error) {
            throw new BadRequestException('Failed to reset deposit');
        }
    }
}
