import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";

type EventFilters = {
    id: number;
    start: string;
    end: string;
    clientId: number;
};

export class EventPaginationOptionsDto extends PaginationOptions {
    constructor(
        public page: number,
        protected _perPage: number,
        public filters: EventFilters,
        public sort: ReturnType<typeof parseSort>
    ) {
        super(page, _perPage);
    }

    static fromQueryObject(query: Record<string, string>): EventPaginationOptionsDto {
        const {
            page = 1,
            perPage = 10,
            orderBy = '',
            id,
            start,
            end,
            clientId,
        } = query;
        return new EventPaginationOptionsDto(+page, +perPage, {
            id: +id,
            start,
            end,
            clientId: +clientId,
        }, parseSort(orderBy, ['createdAt']));
    }
}