export class CommentAnsweredEvent {
    public readonly commentId: number;
    public readonly clientId: number;
    public readonly type: 'recipe' | 'plan'| 'combo';
    public readonly productId: number;

    constructor(data: Omit<CommentAnsweredEvent, ''>) {
        Object.assign(this, data);
    }
}