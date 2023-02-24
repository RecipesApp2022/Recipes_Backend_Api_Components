import { parseSort } from 'src/database/utils/sort';
import { PaginationOptions } from 'src/support/pagination/pagination-options';

type ShoppintListFilters = {
  id: string;
  name: string;
  clientId: number;
};

export class ShoppingListPaginationOptionsDto extends PaginationOptions {
  constructor(
    public page: number,
    protected _perPage: number,
    public filters: ShoppintListFilters,
    public sort: ReturnType<typeof parseSort>,
  ) {
    super(page, _perPage);
  }

  static fromQueryObject(
    query: Record<string, string>,
  ): ShoppingListPaginationOptionsDto {
    const { page = 1, perPage = 10, orderBy = '', id, name, clientId } = query;

    return new ShoppingListPaginationOptionsDto(
      +page,
      +perPage,
      {
        id,
        name,
        clientId: +clientId,
      },
      parseSort(orderBy, ['createdAt']),
    );
  }
}
