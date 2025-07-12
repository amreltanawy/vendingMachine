import { ICommand } from '@nestjs/cqrs';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';

export class DepositCommand implements ICommand {
    constructor(
        public readonly userId: UserId,
        public readonly amount: number
    ) { }
}