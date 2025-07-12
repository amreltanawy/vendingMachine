// src/application/user/queries/get-user.query.ts
import { IQuery } from '@nestjs/cqrs';
import { UserId } from 'src/domain/user/value-objects/user-id.vo';

/**
 * Query to retrieve a user by their unique identifier.
 * 
 * Used in the read-side of CQRS to fetch user information
 * without side effects. The query handler will:
 *  • validate the user exists
 *  • return user data as UserResponseDto
 *  • exclude sensitive information (password, salt)
 */
export class GetUserQuery implements IQuery {
    constructor(public readonly userId: UserId) { }
}
