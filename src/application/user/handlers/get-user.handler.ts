// src/application/user/handlers/get-user.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { GetUserQuery } from '../queries/get-user.query';
import { IUserRepository } from '../../../domain/user/repositories/user.irepository';
import { UserResponseDto } from '../dtos/user-response.dto';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(query: GetUserQuery): Promise<UserResponseDto> {
    // Validate input
    if (!query.userId) {
      throw new BadRequestException('User ID is required');
    }

    try {
      // Find user by ID
      const user = await this.userRepository.findById(query.userId);

      if (!user) {
        throw new NotFoundException('User not found');
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
      if (error.message.includes('Invalid UUID')) {
        throw new BadRequestException('Invalid user ID format');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve user');
    }
  }
}
