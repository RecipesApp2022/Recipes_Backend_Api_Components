import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";

type AdminFilters = {
  id: string;
  email: string;
  status: string;
  name: string;
  userStatusCode: string;
};

export class AdminPaginationOptionsDto extends PaginationOptions {
  constructor(
    public page: number,
    protected _perPage: number,
    public filters: AdminFilters,
    public sort: ReturnType<typeof parseSort>
  ) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): AdminPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      orderBy = '',
      id,
      email,
      name,
      status,
      userStatusCode,
    } = query;
    return new AdminPaginationOptionsDto(+page, +perPage, {
      id,
      email,
      name,
      status,
      userStatusCode
    }, parseSort(orderBy, ['createdAt']));
  }
}
