// src/domain/product-event/value-objects/product-event-id.vo.ts
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { IValueObject, ValueObject } from '../../shared/base/value-object';
import { DomainException } from '../../base/domain-exception';

/**
 * Exception thrown when product event ID validation fails.
 */
class InvalidProductEventIdException extends DomainException {
    constructor(value: string) {
        super(`Invalid UUID for ProductEventId: "${value}"`, 'INVALID_PRODUCT_EVENT_ID', { value });
    }
}

type ProductEventIdProps = {
    value: string;
};

export interface IProductEventId extends IValueObject<ProductEventIdProps> {
    value: string;
}

export class ProductEventId extends ValueObject<ProductEventIdProps> implements IProductEventId {
    private constructor(props: ProductEventIdProps) {
        super(props);
    }

    /** Factory for new random id. */
    public static create(): ProductEventId {
        return new ProductEventId({ value: uuidv4() });
    }

    /** Factory for existing id (e.g., from DB). */
    public static from(value: string): ProductEventId {
        if (!isUuid(value)) {
            throw new InvalidProductEventIdException(value);
        }
        return new ProductEventId({ value });
    }

    /** String representation. */
    get value(): string {
        return this.props.value;
    }

    public toString(): string {
        return this.value;
    }
}
