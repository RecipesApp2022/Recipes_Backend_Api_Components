import { PaginationOptions } from "src/support/pagination/pagination-options";
import { parseSort } from "src/database/utils/sort";

type SellerRatingFilters = {
    sellerId: number;
};

export class SellerRatingPaginationOptionsDto extends PaginationOptions {
    constructor(
        public page: number,
        protected _perPage: number,
        public filters: SellerRatingFilters,
        public sort: ReturnType<typeof parseSort>
    ) {
        super(page, _perPage);
    }

    static fromQueryObject(query: Record<string, string>): SellerRatingPaginationOptionsDto {
        const {
            page = 1,
            perPage = 10,
            orderBy = '',
            sellerId,
        } = query;
        return new SellerRatingPaginationOptionsDto(+page, +perPage, {
            sellerId: +sellerId,
        }, parseSort(orderBy, ['createdAt']));
    }
}