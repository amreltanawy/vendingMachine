// src/application/user/dtos/create-user.dto.ts
import { IsNotEmpty, IsString, MinLength, MaxLength, IsIn } from 'class-validator';

/**
 * Data Transfer Object for user creation requests.
 * 
 * Validates input data at the presentation layer before
 * passing to the CreateUserCommand handler.
 */
export class CreateUserDto {
    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string' })
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    @MaxLength(50, { message: 'Username cannot exceed 50 characters' })
    public readonly username: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(100, { message: 'Password cannot exceed 100 characters' })
    public readonly password: string;

    @IsNotEmpty({ message: 'Role is required' })
    @IsIn(['buyer', 'seller'], { message: 'Role must be either "buyer" or "seller"' })
    public readonly role: 'buyer' | 'seller';

    constructor(username: string, password: string, role: 'buyer' | 'seller') {
        this.username = username;
        this.password = password;
        this.role = role;
    }
}
