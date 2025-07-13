// src/application/user/handlers/get-user.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../queries/get-user.query';
import { IUserRepository } from '../../../domain/user/repositories/user.irepository';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserNotFoundException } from '../exceptions/user-application.exceptions';
import { DomainException } from '../../../domain/base/domain-exception';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(query: GetUserQuery): Promise<UserResponseDto> {
    // Validate input
    if (!query.userId) {
      throw new UserNotFoundException('User ID is required');
    }

    try {
      // Find user by ID
      const user = await this.userRepository.findById(query.userId);

      if (!user) {
        throw new UserNotFoundException(query.userId.value);
      }

      // Map domain entity to response DTO
      return new UserResponseDto(
        user.id.value,
        user.username,
        user.role.value,
        user.deposit.cents,
        user.createdAt,
        user.updatedAt
      );
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }

      if (error instanceof DomainException) {
        throw new UserNotFoundException(query.userId.value);
      }

      throw new UserNotFoundException('Failed to retrieve user');
    }
  }
}

