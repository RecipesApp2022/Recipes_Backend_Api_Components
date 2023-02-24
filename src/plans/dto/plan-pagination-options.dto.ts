import { parseSort } from 'src/database/utils/sort';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import queryStringToBoolean from 'src/support/query-string-to-boolean';

type PlanFilters = {
  id: string;
  sellerId: number;
  clientId: number;
  name: string;
  hideFavoritedForClientId: number;
  hideClientPlans: boolean;
  rating: number;
  orderByMostPurchased: boolean;
};

export class PlanPaginationOptionsDto extends PaginationOptions {
  constructor(
    public page: number,
    protected _perPage: number,
    public filters: PlanFilters,
    public sort: ReturnType<typeof parseSort>,
  ) {
    super(page, _perPage);
  }

  static fromQueryObject(
    query: Record<string, string>,
  ): PlanPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      orderBy = '',
      id,
      sellerId,
      clientId,
      name,
      hideFavoritedForClientId,
      hideClientPlans = '',
      rating,
      orderByMostPurchased,
    } = query;

    return new PlanPaginationOptionsDto(
      +page,
      +perPage,
      {
        id,
        sellerId: +sellerId,
        clientId: +clientId,
        name,
        hideFavoritedForClientId: +hideFavoritedForClientId,
        hideClientPlans: queryStringToBoolean(hideClientPlans),
        rating: +rating,
        orderByMostPurchased: queryStringToBoolean(orderByMostPurchased),
      },
      parseSort(orderBy, ['createdAt', 'rating']),
    );
  }
}
