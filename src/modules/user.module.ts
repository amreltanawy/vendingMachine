// src/modules/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../infrastructure/database/entities/user.orm-entity';
import { UserCredentialOrmEntity } from '../infrastructure/database/entities/user-credential.orm-entity';
import { UserRepositoryImpl } from '../infrastructure/database/repositories/user.repository';
import { UserCredentialRepositoryImpl } from '../infrastructure/database/repositories/user-credential.repository';
import { IUserRepository } from '../domain/user/repositories/user.irepository';
import { IUserCredentialRepository } from '../domain/user/repositories/user-credential.irepository';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserOrmEntity, UserCredentialOrmEntity]),
    ],
    providers: [
        {
            provide: IUserRepository,
            useClass: UserRepositoryImpl,
        },
        {
            provide: IUserCredentialRepository,
            useClass: UserCredentialRepositoryImpl,
        },
    ],
    exports: [IUserRepository, IUserCredentialRepository],
})
export class UserModule { }
