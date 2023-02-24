import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";
import { SavedType } from "../enum/saved-type.enum";

type SavedFilters = {
    id: string;
    types: SavedType[];
    clientId: number;
};

export class SavedPaginationOptionsDto extends PaginationOptions {
    constructor(
        public page: number,
        protected _perPage: number,
        public filters: SavedFilters,
        public sort: ReturnType<typeof parseSort>
    ) {
        super(page, _perPage);
    }

    static fromQueryObject(query: Record<string, string>): SavedPaginationOptionsDto {
        const {
            page = 1,
            perPage = 10,
            orderBy = '',
            id,
            types = '',
            clientId,
        } = query;
        return new SavedPaginationOptionsDto(+page, +perPage, {
            id,
            types: types.split(',').filter(type => type).map(type => type as SavedType),
            clientId: +clientId,
        }, parseSort(orderBy, ['createdAt']));
    }
}