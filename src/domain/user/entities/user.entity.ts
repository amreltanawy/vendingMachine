// src/domain/user/entities/user.entity.ts
import { AggregateRoot } from '@nestjs/cqrs';
import { UserId } from '../value-objects/user-id.vo';
import { UserRole } from '../value-objects/user-role.vo';
import { Money } from '../../shared/value-objects/money.vo';
import { UserCreatedEvent } from '../events/user-created.event';
import { DepositAddedEvent } from '../events/deposit-added.event';
import { UserRoleException } from '../exceptions/user-domain.exceptions';
import { InsufficientFundsException } from '../../shared/exceptions/money-domain.exceptions';

export class User extends AggregateRoot {
    private constructor(
        private readonly _id: UserId,
        private readonly _username: string,
        private _deposit: Money,
        private readonly _role: UserRole,
        private readonly _createdAt: Date,
        private readonly _updatedAt: Date
    ) {
        super();
    }

    static create(
        id: UserId,
        username: string,
        role: UserRole,
        deposit: Money,
        createdAt: Date,
        updatedAt: Date
    ): User {
        const user = new User(id, username, deposit, role, createdAt, updatedAt);
        user.apply(new UserCreatedEvent(id.value, username, role.value));
        return user;
    }

    get id(): UserId {
        return this._id;
    }

    get username(): string {
        return this._username;
    }

    get deposit(): Money {
        return this._deposit;
    }

    get role(): UserRole {
        return this._role;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    canBuyProduct(): boolean {
        return this._role.isBuyer();
    }

    canManageProducts(): boolean {
        return this._role.isSeller();
    }

    addDeposit(amount: Money): void {
        if (!this.canBuyProduct()) {
            throw new UserRoleException('Only buyers can deposit money', { userId: this._id.value, role: this._role.value });
        }

        this._deposit = this._deposit.add(amount);
        this.apply(new DepositAddedEvent(this._id.value, amount.cents));
    }

    resetDeposit(): void {
        if (!this.canBuyProduct()) {
            throw new UserRoleException('Only buyers can reset deposit', { userId: this._id.value, role: this._role.value });
        }

        this._deposit = Money.zero();
    }

    spendMoney(amount: Money): void {
        if (!this.canBuyProduct()) {
            throw new UserRoleException('Only buyers can spend money', { userId: this._id.value, role: this._role.value });
        }

        if (this._deposit.isLessThan(amount)) {
            throw new InsufficientFundsException(this._deposit.cents, amount.cents);
        }

        this._deposit = this._deposit.subtract(amount);
    }
}
