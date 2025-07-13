// src/domain/product-event/value-objects/product-event-type.vo.ts
import { IValueObject, ValueObject } from '../../shared/base/value-object';

type ProductEventTypeLiteral = 'top_up' | 'withdraw';

type ProductEventTypeProps = {
    value: ProductEventTypeLiteral;
};

export interface IProductEventType extends IValueObject<ProductEventTypeProps> {
    value: ProductEventTypeLiteral;
}

export class ProductEventType extends ValueObject<ProductEventTypeProps> implements IProductEventType {
    private constructor(props: ProductEventTypeProps) {
        super(props);
    }

    public static topUp(): ProductEventType {
        return new ProductEventType({ value: 'top_up' });
    }

    public static withdraw(): ProductEventType {
        return new ProductEventType({ value: 'withdraw' });
    }

    public static from(type: string): ProductEventType {
        if (type !== 'top_up' && type !== 'withdraw') {
            throw new Error(`Invalid product event type: "${type}"`);
        }
        return new ProductEventType({ value: type as ProductEventTypeLiteral });
    }

    get value(): ProductEventTypeLiteral {
        return this.props.value;
    }

    public isTopUp(): boolean {
        return this.value === 'top_up';
    }

    public isWithdraw(): boolean {
        return this.value === 'withdraw';
    }

    public toString(): string {
        return this.value;
    }
}
