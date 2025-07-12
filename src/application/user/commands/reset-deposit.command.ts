// src/application/user/commands/reset-deposit.command.ts
import { ICommand } from '@nestjs/cqrs';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';

/**
 * Command that resets a buyer’s current deposit back to zero
 * and returns remaining change (handled in the domain layer).
 *
 * The handler must:
 *  • verify the user is a buyer
 *  • call the aggregate’s `resetDeposit()` behaviour
 */
export class ResetDepositCommand implements ICommand {
    constructor(public readonly userId: UserId) { }
}
