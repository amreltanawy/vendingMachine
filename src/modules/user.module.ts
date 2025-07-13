// src/modules/user.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// ORM Entities
import { UserOrmEntity } from '../infrastructure/database/entities/user.orm-entity';
import { UserCredentialOrmEntity } from '../infrastructure/database/entities/user-credential.orm-entity';

// Repository Interfaces and Implementations
import { UserRepositoryImpl } from '../infrastructure/database/repositories/user.repository';
import { UserCredentialRepositoryImpl } from '../infrastructure/database/repositories/user-credential.repository';
import { IUserRepository } from '../domain/user/repositories/user.irepository';
import { IUserCredentialRepository } from '../domain/user/repositories/user-credential.irepository';

// Handlers
import { CreateUserHandler } from '../application/user/handlers/create-user.handler';
import { DepositHandler } from '../application/user/handlers/deposit.handler';
import { ResetDepositHandler } from '../application/user/handlers/reset-deposit.handler';
import { GetUserHandler } from '../application/user/handlers/get-user.handler';

// Services
import { UserApplicationService } from '../application/user/services/user.service';
import { DatabaseModule } from './database.module';

const CommandHandlers = [
    CreateUserHandler,
    DepositHandler,
    ResetDepositHandler,
];

const QueryHandlers = [
    GetUserHandler,
];

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([UserOrmEntity, UserCredentialOrmEntity]),
        CqrsModule, // Add this line - provides CommandBus and QueryBus
    ],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
        {
            provide: IUserRepository,
            useClass: UserRepositoryImpl,
        },
        {
            provide: IUserCredentialRepository,
            useClass: UserCredentialRepositoryImpl,
        },
        UserApplicationService,
    ],
    exports: [UserApplicationService, IUserRepository, IUserCredentialRepository],
})
export class UserModule { }
