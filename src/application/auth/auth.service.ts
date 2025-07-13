// src/application/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserCredentialRepository } from '../../domain/user/repositories/user-credential.irepository';
import { IUserRepository } from '../../domain/user/repositories/user.irepository';
import { UserAuthenticationException } from '../user/exceptions/user-application.exceptions';
import * as bcrypt from 'bcryptjs';
import { User } from '../../domain/user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userRepository: IUserRepository,
        private userCredentialRepository: IUserCredentialRepository,
    ) { }

    async validateUser(username: string, password: string): Promise<User> {
        const credential = await this.userCredentialRepository.findByUsername(username);
        if (!credential) {
            throw new UserAuthenticationException('Invalid credentials');
        }
        const passwordHash = await bcrypt.hash(password, credential.salt);

        const isPasswordValid = passwordHash === credential.passwordHash;

        if (!isPasswordValid) {
            throw new UserAuthenticationException('Invalid credentials');
        }

        return await this.userRepository.findByUsername(username);
    }

    async login(username: string, password: string) {
        const user = await this.validateUser(username, password);

        const payload = {
            username: user.username,
            sub: user.id.value,
            role: user.role.value
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id.value,
                username: user.username,
                role: user.role.value,
            }
        };
    }
}