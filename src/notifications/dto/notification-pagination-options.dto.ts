import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";
import queryStringToBoolean from "src/support/query-string-to-boolean";

type NotificationFilters = {
    id: string;
    unreadOnly: boolean;
};

export class NotificationPaginationOptionsDto extends PaginationOptions {
    constructor(
        public page: number,
        protected _perPage: number,
        public filters: NotificationFilters,
        public sort: ReturnType<typeof parseSort>
    ) {
        super(page, _perPage);
    }

    static fromQueryObject(query: Record<string, string>): NotificationPaginationOptionsDto {
        const {
            page = 1,
            perPage = 10,
            orderBy = '',
            id,
            unreadOnly = '',
        } = query;
        return new NotificationPaginationOptionsDto(+page, +perPage, {
            id,
            unreadOnly: queryStringToBoolean(unreadOnly),
        }, parseSort(orderBy, ['createdAt', 'id']));
    }
}