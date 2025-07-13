// src/infrastructure/security/authentication/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserRepository } from '../../../domain/user/repositories/user.irepository';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { UserMapper } from '../../../infrastructure/database/mappers/user.mapper';
import { UserOrmEntity } from '../../../infrastructure/database/entities/user.orm-entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userRepository: IUserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_SECRET || 'secret',
        });
    }

    async validate(payload: any) {
        const userId = UserId.from(payload.sub);
        const user = await this.userRepository.findById(userId) as unknown as UserOrmEntity;

        if (!user) {
            throw new UnauthorizedException();
        }

        return UserMapper.toDomain(user);
    }
}
