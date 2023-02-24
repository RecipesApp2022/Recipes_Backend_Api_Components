import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";
import queryStringToBoolean from "src/support/query-string-to-boolean";

type CategoryFilters = {
    id: string;
    name: string;
    parentId: number;
    onlyParents: boolean;
};

export class CategoryPaginationOptionsDto extends PaginationOptions {
    constructor(
        public page: number,
        protected _perPage: number,
        public filters: CategoryFilters,
        public sort: ReturnType<typeof parseSort>
    ) {
        super(page, _perPage);
    }

    static fromQueryObject(query: Record<string, string>): CategoryPaginationOptionsDto {
        const {
            page = 1,
            perPage = 10,
            orderBy = '',
            id,
            name,
            parentId,
            onlyParents,
        } = query;
        return new CategoryPaginationOptionsDto(+page, +perPage, {
            id,
            name,
            parentId: +parentId,
            onlyParents: queryStringToBoolean(onlyParents, false),
        }, parseSort(orderBy, ['createdAt', 'id']));
    }
}