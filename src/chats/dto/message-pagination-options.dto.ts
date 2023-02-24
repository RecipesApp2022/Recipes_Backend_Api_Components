import { orderBy } from "lodash";
import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";

type MessageFilters = {
    id: number;
    idAfter: number;
};

export class MessagePaginationOptionsDto extends PaginationOptions {
    constructor(
        public page: number,
        protected _perPage: number,
        public filters: MessageFilters,
        public sort: ReturnType<typeof parseSort>
    ) {
        super(page, _perPage);
    }

    static fromQueryObject(query: Record<string, string>): MessagePaginationOptionsDto {
        const {
            page = 1,
            perPage = 10,
            orderBy = '',
            id,
            idAfter,
        } = query;
        return new MessagePaginationOptionsDto(+page, +perPage, {
            id: +id,
            idAfter: +idAfter,
        }, parseSort(orderBy, ['createdAt']));
    }
}