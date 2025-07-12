// src/domain/user/value-objects/user-role.vo.ts
import { IValueObject, ValueObject } from '../../shared/base/value-object';

type RoleLiteral = 'buyer' | 'seller';

type UserRoleProps = {
    value: RoleLiteral;
};

export interface IUserRole extends IValueObject<UserRoleProps> {
    value: RoleLiteral;
}

export class UserRole extends ValueObject<UserRoleProps> implements IUserRole {
    private constructor(props: UserRoleProps) {
        super(props);
    }

    /** Static constructors ensure correctness and intentful API. */
    public static buyer(): UserRole {
        return new UserRole({ value: 'buyer' });
    }
    public static seller(): UserRole {
        return new UserRole({ value: 'seller' });
    }
    public static from(role: string): UserRole {
        if (role !== 'buyer' && role !== 'seller') {
            throw new Error(`Unsupported role "${role}"`);
        }
        return new UserRole({ value: role as RoleLiteral });
    }

    get value(): RoleLiteral {
        return this.props.value;
    }

    /* Convenience guards often used in domain rules */
    public isBuyer(): boolean {
        return this.value === 'buyer';
    }
    public isSeller(): boolean {
        return this.value === 'seller';
    }

    public toString(): string {
        return this.value;
    }
}
