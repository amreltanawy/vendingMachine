// src/presentation/controllers/auth.controller.ts
import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../application/auth/auth.service';
import { LoginDto } from '../../application/auth/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body(ValidationPipe) loginDto: LoginDto) {
        return this.authService.login(loginDto.username, loginDto.password);
    }
}
