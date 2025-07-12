// src/domain/user/entities/user.entity.ts
import { AggregateRoot } from '@nestjs/cqrs';
import { UserId } from '../value-objects/user-id.vo';
import { UserRole } from '../value-objects/user-role.vo';
import { Money } from '../../shared/value-object/money.vo';
import { UserCreatedEvent } from '../events/user-created.event';
import { DepositAddedEvent } from '../events/deposit-added.event';

export class User extends AggregateRoot {
    private constructor(
        private readonly _id: UserId,
        private readonly _username: string,
        private _deposit: Money,
        private readonly _role: UserRole
    ) {
        super();
    }

    static create(
        id: UserId,
        username: string,
        role: UserRole
    ): User {
        const user = new User(id, username, Money.zero(), role);
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

    canBuyProduct(): boolean {
        return this._role.isBuyer();
    }

    canManageProducts(): boolean {
        return this._role.isSeller();
    }

    addDeposit(amount: Money): void {
        if (!this.canBuyProduct()) {
            throw new Error('Only buyers can deposit money');
        }

        this._deposit = this._deposit.add(amount);
        this.apply(new DepositAddedEvent(this._id.value, amount.cents));
    }

    resetDeposit(): void {
        if (!this.canBuyProduct()) {
            throw new Error('Only buyers can reset deposit');
        }

        this._deposit = Money.zero();
    }

    spendMoney(amount: Money): void {
        if (!this.canBuyProduct()) {
            throw new Error('Only buyers can spend money');
        }

        if (this._deposit.isLessThan(amount)) {
            throw new Error('Insufficient funds');
        }

        this._deposit = this._deposit.subtract(amount);
    }
}
