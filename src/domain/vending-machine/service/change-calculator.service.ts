// src/domain/vending-machine/services/change-calculator.service.ts
import { Money } from '../../shared/value-objects/money.vo';

export interface ChangeCalculatorService {
    calculateChange(amount: Money): Array<{ denomination: number; count: number }>;
}

export class ChangeCalculatorServiceImpl implements ChangeCalculatorService {
    private static readonly DENOMINATIONS = [100, 50, 20, 10, 5];

    calculateChange(amount: Money): Array<{ denomination: number; count: number }> {
        const change: Array<{ denomination: number; count: number }> = [];
        let remainingCents = amount.cents;

        for (const denomination of ChangeCalculatorServiceImpl.DENOMINATIONS) {
            if (remainingCents >= denomination) {
                const count = Math.floor(remainingCents / denomination);
                change.push({ denomination, count });
                remainingCents -= count * denomination;
            }
        }

        return change;
    }
}
