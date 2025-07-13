// src/modules/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../infrastructure/security/authentication/jwt.strategy';
import { JwtAuthGuard } from '../infrastructure/security/authentication/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/authorization/roles.guard';
import { UserModule } from './user.module';
import { AuthService } from '../application/auth/auth.service';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret',
            signOptions: { expiresIn: process.env.JWT_EXPIRATION || '3600s' },
        }),
    ],
    providers: [JwtStrategy, JwtAuthGuard, RolesGuard, AuthService],
    exports: [JwtModule, JwtAuthGuard, RolesGuard, AuthService],
})
export class AuthModule { }
