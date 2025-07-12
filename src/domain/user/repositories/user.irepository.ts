// src/domain/user/repositories/user.repository.ts
import { User } from '../entities/user.entity';
import { UserId } from '../value-objects/user-id.vo';

/**
 * Domain repository interface for User aggregate.
 * Defines the contract for user persistence operations.
 * This interface lives in the domain layer and is implemented
 * by the infrastructure layer, following the Dependency Inversion Principle.
 */
export interface IUserRepository {
    /**
     * Find user by unique identifier.
     * @param id - User unique identifier
     * @returns User entity or null if not found
     */
    findById(id: UserId): Promise<User | null>;

    /**
     * Find user by username.
     * @param username - Unique username
     * @returns User entity or null if not found
     */
    findByUsername(username: string): Promise<User | null>;

    /**
     * Save or update user aggregate.
     * @param user - User entity to persist
     */
    save(user: User): Promise<void>;

    /**
     * Delete user by identifier.
     * @param id - User unique identifier
     */
    delete(id: UserId): Promise<void>;

    /**
     * Check if username exists.
     * @param username - Username to check
     * @returns Boolean indicating if username exists
     */
    existsByUsername(username: string): Promise<boolean>;

    /**
     * Find all users (for admin operations).
     * @returns Array of user entities
     */
    findAll(): Promise<User[]>;

    /**
     * Count total users.
     * @returns Total number of users
     */
    count(): Promise<number>;
}
