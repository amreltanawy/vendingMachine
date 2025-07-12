// src/application/user/commands/create-user.command.ts
import { ICommand } from '@nestjs/cqrs';

export class CreateUserCommand implements ICommand {
    constructor(
        public readonly username: string,
        public readonly password: string,
        public readonly role: 'buyer' | 'seller'
    ) { }
}
