// src/domain/user/repositories/user-credential.repository.ts
import { UserCredential } from '../entities/user-credential.entity';
import { UserId } from '../value-objects/user-id.vo';

/**
 * Domain repository interface for UserCredential aggregate.
 * Handles secure storage and retrieval of user authentication credentials.
 * Separated from the main user repository for security and single responsibility.
 */
export abstract class IUserCredentialRepository {
    /**
     * Find credentials by user identifier.
     * @param userId - User unique identifier
     * @returns UserCredential entity or null if not found
     */
    abstract findByUserId(userId: UserId): Promise<UserCredential | null>;

    /**
     * Find credentials by username.
     * @param username - User unique identifier
     * @returns UserCredential entity or null if not found
     */
    abstract findByUsername(username: string): Promise<UserCredential | null>;

    /**
     * Save or update user credentials.
     * @param credential - UserCredential entity to persist
     */
    abstract save(credential: UserCredential): Promise<void>;

    /**
     * Delete credentials by user identifier.
     * @param userId - User unique identifier
     */
    abstract deleteByUserId(userId: UserId): Promise<void>;

    /**
     * Check if credentials exist for user.
     * @param userId - User unique identifier
     * @returns Boolean indicating if credentials exist
     */
    abstract existsByUserId(userId: UserId): Promise<boolean>;

    /**
     * Update password hash for user.
     * @param userId - User unique identifier
     * @param passwordHash - New password hash
     */
    abstract updatePasswordHash(userId: UserId, passwordHash: string): Promise<void>;
}
