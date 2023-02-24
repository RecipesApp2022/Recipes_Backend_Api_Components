export class ProductRatedEvent {
    public readonly productId: number;
    public readonly type: 'recipe' | 'plan' | 'combo';
    public readonly value: number;

    constructor(data: Omit<ProductRatedEvent, ''>) {
        Object.assign(this, data);
    }
}