// src/application/user/handlers/create-user.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcryptjs';
import { CreateUserCommand } from '../commands/create-user.command';
import { IUserRepository } from '../../../domain/user/repositories/user.irepository';
import { IUserCredentialRepository } from '../../../domain/user/repositories/user-credential.irepository';
import { User } from '../../../domain/user/entities/user.entity';
import { UserCredential } from '../../../domain/user/entities/user-credential.entity';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { UserRole } from '../../../domain/user/value-objects/user-role.vo';
import { Money } from 'src/domain/shared/value-objects/money.vo';
import { UserCreationException, UsernameAlreadyExistsException } from '../exceptions/user-application.exceptions';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly userCredentialRepository: IUserCredentialRepository
    ) { }

    async execute(command: CreateUserCommand): Promise<UserId> {
        // Validate input
        if (!command.username || !command.password || !command.role) {
            throw new UserCreationException('Username, password, and role are required');
        }

        // Check if username already exists
        const existingUser = await this.userRepository.findByUsername(command.username);
        if (existingUser) {
            throw new UsernameAlreadyExistsException(command.username);
        }

        // Generate new user ID
        const userId = UserId.create();

        // Create user role value object
        const userRole = UserRole.from(command.role);

        // Create user domain entity
        const user = User.create(
            userId,
            command.username,
            userRole,
            Money.zero(),
            new Date(),
            new Date()
        );

        // Hash password with salt
        const saltRounds = 12;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(command.password, salt);

        // Create user credentials
        const userCredential = new UserCredential(
            userId,
            passwordHash,
            salt,
            new Date(),
            new Date()
        );

        // Save user and credentials in a transaction-like manner
        try {
            await this.userRepository.save(user);
            await this.userCredentialRepository.save(userCredential);

            // Commit events (handled by NestJS CQRS)
            user.commit();

            return userId;
        } catch (error) {
            if (error instanceof UserCreationException || error instanceof UsernameAlreadyExistsException) {
                throw error;
            }
            // Rollback if either save fails
            throw new UserCreationException('Failed to create user account', { originalError: error.message });
        }
    }
}
