import { parseSort } from 'src/database/utils/sort';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { Role } from 'src/users/enums/role.enum';

type NotificationTypeFilters = {
  code: string;
  name: string;
  role: Role;
};

export class NotificationTypePaginationOptionsDto extends PaginationOptions {
  constructor(
    public page: number,
    protected _perPage: number,
    public filters: NotificationTypeFilters,
    public sort: ReturnType<typeof parseSort>,
  ) {
    super(page, _perPage);
  }

  static fromQueryObject(
    query: Record<string, string>,
  ): NotificationTypePaginationOptionsDto {
    const { page = 1, perPage = 10, orderBy = '', code, name, role } = query;
    return new NotificationTypePaginationOptionsDto(
      +page,
      +perPage,
      {
        code,
        name,
        role: role as Role,
      },
      parseSort(orderBy, ['code', 'name']),
    );
  }
}
