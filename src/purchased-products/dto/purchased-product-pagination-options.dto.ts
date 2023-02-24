import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";
import { PurchasedProductType } from "../types/purchased-product-type";

type PurchasedProductFilters = {
  productId: number;
  name: string;
  type: PurchasedProductType;
};

export class PurchasedProductPaginationOptionsDto extends PaginationOptions {
  constructor(
    public page: number,
    protected _perPage: number,
    public filters: PurchasedProductFilters,
    public sort: ReturnType<typeof parseSort>
  ) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): PurchasedProductPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      orderBy = '',
      productId,
      name,
      type,
    } = query;

    return new PurchasedProductPaginationOptionsDto(+page, +perPage, {
      productId: +productId,
      name,
      type: type as PurchasedProductType,
    }, parseSort(orderBy, ['createdAt']));
  }
}
