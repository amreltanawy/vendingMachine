// src/application/product-event/queries/get-product-events.query.ts
import { IQuery } from '@nestjs/cqrs';

export class GetProductEventsQuery implements IQuery {
  constructor(
    public readonly productId: string,
    public readonly eventType?: 'top_up' | 'withdraw',
    public readonly limit?: number
  ) { }
}
