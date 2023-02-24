import { parseSort } from 'src/database/utils/sort';
import { PaginationOptions } from 'src/support/pagination/pagination-options';

type RecipeByHierarchyFilters = {
  name: string;
};

export class RecipeByHierarchyPaginationOptionsDto extends PaginationOptions {
  constructor(
    public page: number,
    protected _perPage: number,
    public filters: RecipeByHierarchyFilters,
    public sort: ReturnType<typeof parseSort>,
  ) {
    super(page, _perPage);
  }

  static fromQueryObject(
    query: Record<string, string>,
  ): RecipeByHierarchyPaginationOptionsDto {
    const { page = 1, perPage = 10, orderBy = '', name } = query;

    return new RecipeByHierarchyPaginationOptionsDto(
      +page,
      +perPage,
      {
        name,
      },
      parseSort(orderBy, ['createdAt']),
    );
  }
}
