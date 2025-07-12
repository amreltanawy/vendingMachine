// src/domain/user/events/user-created.event.ts
import { DomainEvent, IDomainEvent } from '../../shared/base/event';


export interface IUserCreatedEvent extends IDomainEvent {
    username: string;
    role: string;
}

export class UserCreatedEvent extends DomainEvent implements IUserCreatedEvent {
    public readonly username: string;
    public readonly role: string;

    constructor(
        aggregateId: string,
        username: string,
        role: string,
        eventVersion: number = 1
    ) {
        super(aggregateId, eventVersion);
        this.username = username;
        this.role = role;
    }

    public getEventName(): string {
        return 'UserCreated';
    }

    public getEventData(): Record<string, any> {
        return {
            ...super.getEventData(),
            username: this.username,
            role: this.role,
        };
    }
}
