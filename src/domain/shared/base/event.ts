// src/domain/base/event.ts

export interface IDomainEvent {
    getEventName(): string;
    getEventData(): Record<string, any>;
    toString(): string;
}

export abstract class DomainEvent implements IDomainEvent {
    private readonly _id: string;
    public readonly occurredOn: Date;
    public readonly eventVersion: number;

    protected constructor(
        public readonly aggregateId: string,
        eventVersion: number = 1
    ) {
        this.occurredOn = new Date();
        this.eventVersion = eventVersion;
    }

    /**
     * Unique identifier for this event type.
     * Used for event routing and deserialization.
     */
    public abstract getEventName(): string;

    /**
     * Serialize event data for persistence or messaging.
     * Override in concrete events to include specific data.
     */
    public getEventData(): Record<string, any> {
        return {
            aggregateId: this.aggregateId,
            occurredOn: this.occurredOn.toISOString(),
            eventVersion: this.eventVersion,
        };
    }

    /**
     * String representation for debugging and logging.
     */
    public toString(): string {
        return `${this.getEventName()}(${this.aggregateId}) at ${this.occurredOn.toISOString()}`;
    }
}
