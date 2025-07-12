import { UserId } from "../value-objects/user-id.vo";

export class UserCredential {
    constructor(
        private readonly _userId: UserId,
        private readonly _passwordHash: string,
        private readonly _salt: string,
        private readonly _createdAt?: Date,
        private readonly _updatedAt?: Date,
    ) { }

    get userId(): UserId {
        return this._userId;
    }
    get passwordHash(): string {
        return this._passwordHash;
    }
    get salt(): string {
        return this._salt;
    }
    get createdAt(): Date | undefined {
        return this._createdAt;
    }
    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }
}
