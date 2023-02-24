import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";

type ChatFilters = {
    id: string;
};

export class ChatPaginationOptionsDto extends PaginationOptions {
    constructor(
        public page: number,
        protected _perPage: number,
        public filters: ChatFilters,
        public sort: ReturnType<typeof parseSort>
    ) {
        super(page, _perPage);
    }

    static fromQueryObject(query: Record<string, string>): ChatPaginationOptionsDto {
        const {
            page = 1,
            perPage = 10,
            orderBy = '',
            id,
        } = query;
        return new ChatPaginationOptionsDto(+page, +perPage, {
            id,
        }, parseSort(orderBy, ['createdAt']));
    }
}