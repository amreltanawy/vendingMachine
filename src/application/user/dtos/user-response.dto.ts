// src/application/user/dtos/user-response.dto.ts

/**
 * Data Transfer Object for user query responses.
 * 
 * Represents the safe, public view of user data that can be
 * returned to clients. Excludes sensitive information like
 * password hashes and salts.
 */
export class UserResponseDto {
    public readonly id: string;
    public readonly username: string;
    public readonly role: 'buyer' | 'seller';
    public readonly deposit: number; // in cents
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(
        id: string,
        username: string,
        role: 'buyer' | 'seller',
        deposit: number,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.deposit = deposit;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Factory method to create UserResponseDto from domain entity.
     * This method would typically be used in the query handler or mapper.
     */
    public static fromDomain(user: any): UserResponseDto {
        return new UserResponseDto(
            user.id.value,
            user.username,
            user.role.value,
            user.deposit.cents,
            user.createdAt,
            user.updatedAt
        );
    }

    /**
     * Factory method to create UserResponseDto from ORM entity.
     * This method would be used when mapping from database results.
     */
    public static fromOrm(userOrm: any): UserResponseDto {
        return new UserResponseDto(
            userOrm.id,
            userOrm.username,
            userOrm.role,
            userOrm.deposit,
            userOrm.createdAt,
            userOrm.updatedAt
        );
    }
}
