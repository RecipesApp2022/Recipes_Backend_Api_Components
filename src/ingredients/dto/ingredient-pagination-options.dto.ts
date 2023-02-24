import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";

type IngredientFilters = {
  id: string;
  name: string;
  ingredientTypeId: number;
};

export class IngredientPaginationOptionsDto extends PaginationOptions {
  constructor(
    public page: number,
    protected _perPage: number,
    public filters: IngredientFilters,
    public sort: ReturnType<typeof parseSort>
  ) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): IngredientPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      orderBy = '',
      id,
      name,
      ingredientTypeId,
    } = query;

    return new IngredientPaginationOptionsDto(+page, +perPage, {
      id,
      name,
      ingredientTypeId: +ingredientTypeId,
    }, parseSort(orderBy, ['createdAt', 'id']));
  }
}
