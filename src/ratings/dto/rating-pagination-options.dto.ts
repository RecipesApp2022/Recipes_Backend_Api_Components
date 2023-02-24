import { PaginationOptions } from "src/support/pagination/pagination-options";
import { RatingItemType } from "../types/rating-item-type.enum";
import { parseSort } from "src/database/utils/sort";

type RatingFilters = {
    itemId: number;
    itemType: RatingItemType;
    sellerId: number;
};

export class RatingPaginationOptionsDto extends PaginationOptions {
    constructor(
        public page: number,
        protected _perPage: number,
        public filters: RatingFilters,
        public sort: ReturnType<typeof parseSort>
    ) {
        super(page, _perPage);
    }

    static fromQueryObject(query: Record<string, string>): RatingPaginationOptionsDto {
        const {
            page = 1,
            perPage = 10,
            orderBy = '',
            itemId,
            itemType,
            sellerId,
        } = query;
        return new RatingPaginationOptionsDto(+page, +perPage, {
            itemId: +itemId,
            itemType: itemType as RatingItemType,
            sellerId: +sellerId,
        }, parseSort(orderBy, ['createdAt']));
    }
}