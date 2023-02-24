import { parseSort } from 'src/database/utils/sort';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import queryStringToBoolean from 'src/support/query-string-to-boolean';

type ComboFilters = {
  id: string;
  sellerId: number;
  name: string;
  hideFavoritedForClientId: number;
  rating: number;
  orderByMostPurchased: boolean;
};

export class ComboPaginationOptionsDto extends PaginationOptions {
  constructor(
    public page: number,
    protected _perPage: number,
    public filters: ComboFilters,
    public sort: ReturnType<typeof parseSort>,
  ) {
    super(page, _perPage);
  }

  static fromQueryObject(
    query: Record<string, string>,
  ): ComboPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      orderBy = '',
      id,
      sellerId,
      name,
      hideFavoritedForClientId,
      rating,
      orderByMostPurchased,
    } = query;
    return new ComboPaginationOptionsDto(
      +page,
      +perPage,
      {
        id,
        sellerId: +sellerId,
        name,
        hideFavoritedForClientId: +hideFavoritedForClientId,
        rating: +rating,
        orderByMostPurchased: queryStringToBoolean(orderByMostPurchased),
      },
      parseSort(orderBy, ['createdAt', 'rating']),
    );
  }
}
