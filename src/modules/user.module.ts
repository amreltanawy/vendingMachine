// src/modules/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../infrastructure/database/entities/user.orm-entity';
import { UserCredentialOrmEntity } from '../infrastructure/database/entities/user-credential.orm-entity';
import { UserRepositoryImpl } from '../infrastructure/database/repositories/user.repository';
import { UserCredentialRepositoryImpl } from '../infrastructure/database/repositories/user-credential.repository';
import { IUserRepository } from '../domain/user/repositories/user.irepository';
import { IUserCredentialRepository } from '../domain/user/repositories/user-credential.irepository';
import { CreateUserHandler } from '../application/user/handlers/create-user.handler';
import { DepositHandler } from '../application/user/handlers/deposit.handler';
import { ResetDepositHandler } from '../application/user/handlers/reset-deposit.handler';
import { GetUserHandler } from '../application/user/handlers/get-user.handler';
import { UserApplicationService } from 'src/application/user/services/user.service';


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
        TypeOrmModule.forFeature([UserOrmEntity, UserCredentialOrmEntity]),
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
