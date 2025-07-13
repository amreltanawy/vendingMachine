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
import { Money } from '../../../domain/shared/value-objects/money.vo';
import { UserCreationException, UsernameAlreadyExistsException } from '../exceptions/user-application.exceptions';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly userCredentialRepository: IUserCredentialRepository
    ) { }

    async execute(command: CreateUserCommand): Promise<UserId> {
        console.log('CreateUserHandler: Starting user creation for:', command.username);

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
        console.log('CreateUserHandler: Generated userId:', userId.value);

        // Create user role value object
        const userRole = UserRole.from(command.role);
        console.log('CreateUserHandler: Created user role:', userRole.value);

        // Create user domain entity
        const user = User.create(
            userId,
            command.username,
            userRole,
            Money.zero(),
            new Date(),
            new Date()
        );
        console.log('CreateUserHandler: Created user entity');

        // Hash password with salt
        const saltRounds = 12;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(command.password, salt);
        console.log('CreateUserHandler: Generated password hash');

        // Create user credentials
        const userCredential = new UserCredential(
            userId,
            passwordHash,
            salt,
            new Date(),
            new Date()
        );
        console.log('CreateUserHandler: Created user credentials');

        // Save user and credentials in a transaction-like manner
        try {
            console.log('CreateUserHandler: Saving user...');
            await this.userRepository.save(user);
            console.log('CreateUserHandler: User saved successfully');

            console.log('CreateUserHandler: Saving credentials...');
            await this.userCredentialRepository.save(userCredential);
            console.log('CreateUserHandler: Credentials saved successfully');

            // Commit events (handled by NestJS CQRS)
            user.commit();

            console.log('CreateUserHandler: User creation completed successfully');
            return userId;
        } catch (error) {
            console.error('CreateUserHandler: Error during save operations:', error);
            console.error('CreateUserHandler: Error stack:', error.stack);
            console.error('CreateUserHandler: Error message:', error.message);

            if (error instanceof UserCreationException || error instanceof UsernameAlreadyExistsException) {
                throw error;
            }
            // Include more detailed error information
            throw new UserCreationException(
                `Failed to create user account: ${error.message}`,
                {
                    originalError: error.message,
                    errorType: error.constructor.name,
                    username: command.username,
                    userId: userId.value
                }
            );
        }
    }
}
