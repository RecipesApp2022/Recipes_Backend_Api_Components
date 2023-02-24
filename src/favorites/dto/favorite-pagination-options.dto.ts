import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";
import { FavoriteReaction } from "../enum/favorite-reaction.enum";
import { FavoriteType } from "../enum/favorite-type.enum";

type FavoriteFilters = {
    id: string;
    types: FavoriteType[];
    reactions: FavoriteReaction[];
    clientId: number;
};

export class FavoritePaginationOptionsDto extends PaginationOptions {
    constructor(
        public page: number,
        protected _perPage: number,
        public filters: FavoriteFilters,
        public sort: ReturnType<typeof parseSort>
    ) {
        super(page, _perPage);
    }

    static fromQueryObject(query: Record<string, string>): FavoritePaginationOptionsDto {
        const {
            page = 1,
            perPage = 10,
            orderBy = '',
            id,
            types = '',
            reactions = '',
            clientId,
        } = query;
        return new FavoritePaginationOptionsDto(+page, +perPage, {
            id,
            types: types.split(',').filter(type => type).map(type => type as FavoriteType),
            reactions: reactions.split(',').filter(reaction => reaction).map(reaction => reaction as FavoriteReaction),
            clientId: +clientId,
        }, parseSort(orderBy, ['createdAt']));
    }
}