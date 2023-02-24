import { parseSort } from 'src/database/utils/sort';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import queryStringToBoolean from 'src/support/query-string-to-boolean';

type RecipeFilters = {
  id: string;
  name: string;
  sellerId: number;
  hideFavoritedForClientId: number;
  rating: number;
  orderByMostPurchased: boolean;
};

export class RecipePaginationOptionsDto extends PaginationOptions {
  constructor(
    public page: number,
    protected _perPage: number,
    public filters: RecipeFilters,
    public sort: ReturnType<typeof parseSort>,
  ) {
    super(page, _perPage);
  }

  static fromQueryObject(
    query: Record<string, string>,
  ): RecipePaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      orderBy = '',
      id,
      name,
      sellerId,
      hideFavoritedForClientId,
      rating,
      orderByMostPurchased,
    } = query;

    return new RecipePaginationOptionsDto(
      +page,
      +perPage,
      {
        id,
        name,
        sellerId: +sellerId,
        hideFavoritedForClientId: +hideFavoritedForClientId,
        rating: +rating,
        orderByMostPurchased: queryStringToBoolean(orderByMostPurchased),
      },
      parseSort(orderBy, ['createdAt', 'rating', 'preparationTime']),
    );
  }
}
