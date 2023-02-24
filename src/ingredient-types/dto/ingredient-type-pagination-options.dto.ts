import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";

type IngredientTypeFilters = {
  id: string;
  name: string;
};

export class IngredientTypePaginationOptionsDto extends PaginationOptions {
  constructor(
    public page: number,
    protected _perPage: number,
    public filters: IngredientTypeFilters,
    public sort: ReturnType<typeof parseSort>
  ) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): IngredientTypePaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      orderBy = '',
      id,
      name,
    } = query;

    return new IngredientTypePaginationOptionsDto(+page, +perPage, {
      id,
      name,
    }, parseSort(orderBy, ['createdAt', 'id']));
  }
}
