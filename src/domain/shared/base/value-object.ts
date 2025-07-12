export abstract class ValueObject<TProps extends Record<string, unknown>> {
    protected readonly props: TProps;

    protected constructor(props: TProps) {
        this.props = Object.freeze(props);          // deep immutability for consumers
    }

    /**
     * Two value objects are equal when all their props are equal.
     */
    public equals(vo?: ValueObject<TProps>): boolean {
        if (vo === null || vo === undefined) return false;
        if (vo === this) return true;
        if (vo.constructor.name !== this.constructor.name) return false;

        return JSON.stringify(this.props) === JSON.stringify(vo.props);
    }

    /**
     * Provide raw props for mapping layers (DTO / persistence).
     * NEVER expose mutable references.
     */
    public unwrap(): TProps {
        return { ...this.props };
    }
}


export interface IValueObject<TProps extends Record<string, unknown>> {
    equals(vo?: ValueObject<TProps>): boolean;
    unwrap(): TProps;
}