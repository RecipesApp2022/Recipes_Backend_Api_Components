import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";

type CommentFilters = {
    id: string;
    name: string;
    sellerId: number;
    clientId: number;
    comment: string;
    recipeId: number;
    planId: number;
    comboId: number;
};

export class CommentPaginationOptionsDto extends PaginationOptions {
    constructor(
        public page: number,
        protected _perPage: number,
        public filters: CommentFilters,
        public sort: ReturnType<typeof parseSort>
    ) {
        super(page, _perPage);
    }

    static fromQueryObject(query: Record<string, string>): CommentPaginationOptionsDto {
        const {
            page = 1,
            perPage = 10,
            orderBy = '',
            id,
            name,
            sellerId,
            clientId,
            comment,
            recipeId,
            planId,
            comboId,
        } = query;
        return new CommentPaginationOptionsDto(+page, +perPage, {
            id,
            name,
            sellerId: +sellerId,
            clientId: +clientId,
            comment,
            recipeId: +recipeId,
            planId: +planId,
            comboId: +comboId,
        }, parseSort(orderBy, ['createdAt']));
    }
}