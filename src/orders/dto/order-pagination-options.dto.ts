import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";

type OrderFilters = {
    id: number;
    clientId: number;
    sellerId: number;
};

export class OrderPaginationOptionsDto extends PaginationOptions {
    constructor(
        public page: number,
        protected _perPage: number,
        public filters: OrderFilters,
        public sort: ReturnType<typeof parseSort>
    ) {
        super(page, _perPage);
    }

    static fromQueryObject(query: Record<string, string>): OrderPaginationOptionsDto {
        const {
            page = 1,
            perPage = 10,
            orderBy = '',
            id,
            clientId,
            sellerId,
        } = query;
        return new OrderPaginationOptionsDto(+page, +perPage, {
            id: +id,
            clientId: +clientId,
            sellerId: +sellerId,
        }, parseSort(orderBy, ['createdAt']));
    }
}