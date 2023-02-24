export class CommentCreatedEvent {
    public readonly commentId: number;
    public readonly type: 'recipe' | 'plan'| 'combo';
    public readonly productId: number;

    constructor(data: Omit<CommentCreatedEvent, ''>) {
        Object.assign(this, data);
    }
}