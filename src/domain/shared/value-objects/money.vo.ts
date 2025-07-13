// src/domain/shared/value-objects/money.vo.ts
import { IValueObject, ValueObject } from '../base/value-object';
import { InvalidMoneyValueException, InvalidCoinDenominationException, InsufficientFundsException } from '../exceptions/money-domain.exceptions';

type MoneyProps = {
    cents: number;
};

export interface IMoney extends IValueObject<MoneyProps> {
    cents: number;
}

export class Money extends ValueObject<MoneyProps> implements IMoney {
    /** Vending machine accepts only these coin values. */
    private static readonly VALID_DENOMINATIONS = [5, 10, 20, 50, 100];

    private constructor(props: MoneyProps) {
        super(props);
        if (props.cents < 0) throw new InvalidMoneyValueException('Money cannot be negative', { cents: props.cents });
    }

    /** Zero amount constant. */
    public static zero(): Money {
        return new Money({ cents: 0 });
    }

    /** Any integer cents value (use cautiously outside domain boundaries). */
    public static fromCents(cents: number): Money {
        if (!Number.isInteger(cents)) throw new InvalidMoneyValueException('Money value must be integer cents', { cents });
        return new Money({ cents });
    }

    /** Only factory for user deposits (enforces valid coin size). */
    public static fromValidDenomination(cents: number): Money {
        if (!Money.VALID_DENOMINATIONS.includes(cents)) {
            throw new InvalidCoinDenominationException(cents, Money.VALID_DENOMINATIONS);
        }
        return new Money({ cents });
    }

    public isValidAmount(cents: number): boolean {
        return cents > 0 && (Money.VALID_DENOMINATIONS.includes(cents) || cents % 5 === 0);
    }

    get cents(): number {
        return this.props.cents;
    }

    /* -------- Domain-level arithmetic helpers ---------- */

    public add(other: Money): Money {
        return new Money({ cents: this.cents + other.cents });
    }

    public subtract(other: Money): Money {
        const result = this.cents - other.cents;
        if (result < 0) throw new InsufficientFundsException(this.cents, other.cents);
        return new Money({ cents: result });
    }

    public isLessThan(other: Money): boolean {
        return this.cents < other.cents;
    }

    public toString(): string {
        return (this.cents / 100).toFixed(2);
    }
}
