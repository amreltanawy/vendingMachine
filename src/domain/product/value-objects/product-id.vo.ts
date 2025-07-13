// src/domain/user/value-objects/user-id.vo.ts
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { IValueObject, ValueObject } from '../../shared/base/value-object';

type ProductIdProps = {
    value: string;
};

export interface IProductId extends IValueObject<ProductIdProps> {
    value: string;
}

export class ProductId extends ValueObject<ProductIdProps> implements IProductId {
    private constructor(props: ProductIdProps) {
        super(props);
    }

    /** Factory for new random id. */
    public static create(): ProductId {
        return new ProductId({ value: uuidv4() });
    }

    /** Factory for existing id (e.g., from DB). */
    public static from(value: string): ProductId {
        if (!isUuid(value)) {
            throw new Error(`Invalid UUID for UserId: "${value}"`);
        }
        return new ProductId({ value });
    }

    /** String representation. */
    get value(): string {
        return this.props.value;
    }

    public toString(): string {
        return this.value;
    }
}
