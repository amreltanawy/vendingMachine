// src/application/product/dtos/purchase-result.dto.ts

/**
 * Represents an item purchased in a transaction.
 */
export interface PurchasedItem {
    /**
     * The name of the purchased product.
     */
    name: string;

    /**
     * The quantity of the product purchased.
     */
    quantity: number;
}

/**
 * Represents a change denomination returned to the user.
 */
export interface ChangeDenomination {
    /**
     * The denomination value in cents (e.g., 5, 10, 20, 50, 100).
     */
    denomination: number;

    /**
     * The count of coins/bills of this denomination.
     */
    count: number;
}

/**
 * Data Transfer Object for purchase transaction results.
 * 
 * This DTO encapsulates the complete result of a product purchase,
 * including the total cost, purchased items, and change breakdown.
 */
export class PurchaseResult {
    /**
     * The total cost of the purchase in cents.
     */
    public readonly totalCost: number;

    /**
     * Array of purchased items with their names and quantities.
     */
    public readonly purchasedItems: PurchasedItem[];

    /**
     * Array of change denominations returned to the user.
     */
    public readonly change: ChangeDenomination[];

    /**
     * Creates an instance of PurchaseResult.
     * 
     * @param totalCost - The total cost of the purchase in cents
     * @param purchasedItems - Array of purchased items
     * @param change - Array of change denominations returned
     */
    constructor(
        totalCost: number,
        purchasedItems: PurchasedItem[],
        change: ChangeDenomination[]
    ) {
        this.totalCost = totalCost;
        this.purchasedItems = purchasedItems;
        this.change = change;
    }

    /**
     * Calculates the total amount of change returned in cents.
     * 
     * @returns The total change amount in cents
     */
    public getTotalChangeAmount(): number {
        return this.change.reduce((total, denomination) => {
            return total + (denomination.denomination * denomination.count);
        }, 0);
    }

    /**
     * Gets the total quantity of items purchased.
     * 
     * @returns The total quantity across all purchased items
     */
    public getTotalQuantity(): number {
        return this.purchasedItems.reduce((total, item) => {
            return total + item.quantity;
        }, 0);
    }

    /**
     * Checks if any change was returned.
     * 
     * @returns True if change was returned, false otherwise
     */
    public hasChange(): boolean {
        return this.change.length > 0;
    }

    /**
     * Gets a formatted string representation of the purchase result.
     * 
     * @returns A formatted string describing the purchase
     */
    public toString(): string {
        const itemsList = this.purchasedItems
            .map(item => `${item.quantity}x ${item.name}`)
            .join(', ');

        const changeAmount = this.getTotalChangeAmount();
        const changeText = changeAmount > 0 ? ` (Change: ${changeAmount} cents)` : '';

        return `Purchase: ${itemsList} - Total: ${this.totalCost} cents${changeText}`;
    }
}
