// src/presentation/controllers/user.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/security/authentication/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/security/authorization/roles.guard';
import { Roles } from '../../infrastructure/security/authorization/roles.decorator';
import { UserApplicationService } from '../../application/user/services/user.service';
import { CreateUserDto } from '../../application/user/dtos/create-user.dto';
import { UserRole } from 'src/domain/user/value-objects/user-role.vo';
import { UserId } from 'src/domain/user/value-objects/user-id.vo';
import { UserAuthorizationException } from '../../application/user/exceptions/user-application.exceptions';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserApplicationService) { }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.userService.createUser(createUserDto);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getUser(@Request() req: any, @Param('id') id: string) {
        if (!req.user.userId.equals(UserId.from(id))) {
            throw new UserAuthorizationException('fetch this user', req.user.role);
        }
        return await this.userService.getUser(req.user.userId);
    }

    @Post('deposit')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.buyer().toString())
    async deposit(@Request() req: any, @Body() body: { amount: number }) {
        return await this.userService.deposit(req.user.userId, body.amount);
    }

    @Post('reset')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.buyer().toString())
    async resetDeposit(@Request() req: any) {
        return this.userService.resetDeposit(req.user.userId);
    }
}
