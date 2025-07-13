// src/domain/user/value-objects/user-id.vo.ts
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { IValueObject, ValueObject } from '../../shared/base/value-object';
import { DomainException } from '../../base/domain-exception';

/**
 * Exception thrown when user ID validation fails.
 */
class InvalidUserIdException extends DomainException {
  constructor(value: string) {
    super(`Invalid UUID for UserId: "${value}"`, 'INVALID_USER_ID', { value });
  }
}

type UserIdProps = {
  value: string;
};

export interface IUserId extends IValueObject<UserIdProps> {
  value: string;
}

export class UserId extends ValueObject<UserIdProps> implements IUserId {
  private constructor(props: UserIdProps) {
    super(props);
  }

  /** Factory for new random id. */
  public static create(): UserId {
    return new UserId({ value: uuidv4() });
  }

  /** Factory for existing id (e.g., from DB). */
  public static from(value: string): UserId {
    if (!isUuid(value)) {
      throw new InvalidUserIdException(value);
    }
    return new UserId({ value });
  }

  /** String representation. */
  get value(): string {
    return this.props.value;
  }

  public toString(): string {
    return this.value;
  }
}
