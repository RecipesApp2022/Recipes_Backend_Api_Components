import { RatingItemType } from "../types/rating-item-type.enum";

export class ItemRatedEvent {
    constructor(
        public readonly itemId: number,
        public readonly itemType: RatingItemType,
    ) {}
}