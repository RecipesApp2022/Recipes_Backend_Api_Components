import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";

type SellerFilters = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  userStatusCode: string;
  minRating: number;
};

export class SellerPaginationOptionsDto extends PaginationOptions {
  constructor(
    public page: number,
    protected _perPage: number,
    public filters: SellerFilters,
    public sort: ReturnType<typeof parseSort>
  ) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): SellerPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      orderBy = '',
      id,
      name,
      email,
      phoneNumber,
      userStatusCode,
      minRating,
    } = query;

    return new SellerPaginationOptionsDto(+page, +perPage, {
      id,
      name,
      email,
      phoneNumber,
      userStatusCode,
      minRating: +minRating,
    }, parseSort(orderBy, ['createdAt', 'rating']));
  }
}
