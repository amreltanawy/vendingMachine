// src/domain/user/repositories/user.repository.ts
import { User } from '../entities/user.entity';
import { UserId } from '../value-objects/user-id.vo';

/**
 * Domain repository interface for User aggregate.
 * Defines the contract for user persistence operations.
 * This interface lives in the domain layer and is implemented
 * by the infrastructure layer, following the Dependency Inversion Principle.
 */
export abstract class IUserRepository {
    /**
     * Find user by unique identifier.
     * @param id - User unique identifier
     * @returns User entity or null if not found
     */
    abstract findById(id: UserId): Promise<User | null>;

    /**
     * Find user by username.
     * @param username - Unique username
     * @returns User entity or null if not found
     */
    abstract findByUsername(username: string): Promise<User | null>;

    /**
     * Save or update user aggregate.
     * @param user - User entity to persist
     */
    abstract save(user: User): Promise<void>;

    /**
     * Delete user by identifier.
     * @param id - User unique identifier
     */
    abstract delete(id: UserId): Promise<void>;

    /**
     * Check if username exists.
     * @param username - Username to check
     * @returns Boolean indicating if username exists
     */
    abstract existsByUsername(username: string): Promise<boolean>;

    /**
     * Find all users (for admin operations).
     * @returns Array of user entities
     */
    abstract findAll(): Promise<User[]>;

    /**
     * Count total users.
     * @returns Total number of users
     */
    abstract count(): Promise<number>;
}
