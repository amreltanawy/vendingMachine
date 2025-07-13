// src/application/user/services/user.service.ts
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.command';
import { DepositCommand } from '../commands/deposit.command';
import { ResetDepositCommand } from '../commands/reset-deposit.command';
import { GetUserQuery } from '../queries/get-user.query';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';

@Injectable()
export class UserApplicationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) { }

  async createUser(dto: CreateUserDto): Promise<UserId> {
    const command = new CreateUserCommand(dto.username, dto.password, dto.role);
    return await this.commandBus.execute(command);
  }

  async deposit(userId: UserId, amount: number): Promise<void> {
    const command = new DepositCommand(userId, amount);
    await this.commandBus.execute(command);
  }

  async resetDeposit(userId: UserId): Promise<void> {
    const command = new ResetDepositCommand(userId);
    await this.commandBus.execute(command);
  }

  async getUser(userId: UserId): Promise<UserResponseDto> {
    const query = new GetUserQuery(userId);
    return await this.queryBus.execute(query);
  }
}
