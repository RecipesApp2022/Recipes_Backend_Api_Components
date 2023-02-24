export class OrderCreatedEvent {
    public readonly orderId: number;
    public readonly sellerId: number;

    constructor(data: Omit<OrderCreatedEvent, ''>) {
        Object.assign(this, data);
    }
}