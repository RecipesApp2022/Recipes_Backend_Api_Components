import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";

type AdFilters = {
    id: string;
};

export class AdPaginationOptionsDto extends PaginationOptions {
    constructor(
        public page: number,
        protected _perPage: number,
        public filters: AdFilters,
        public sort: ReturnType<typeof parseSort>
    ) {
        super(page, _perPage);
    }

    static fromQueryObject(query: Record<string, string>): AdPaginationOptionsDto {
        const {
            page = 1,
            perPage = 10,
            orderBy = '',
            id,
        } = query;
        return new AdPaginationOptionsDto(+page, +perPage, {
            id,
        }, parseSort(orderBy, ['createdAt']));
    }
}