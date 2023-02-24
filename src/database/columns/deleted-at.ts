import { TableColumnOptions } from "typeorm";

const deletedAt: TableColumnOptions = {
    name: 'deleted_at',
    type: 'timestamp',
    isNullable: true,
}

export default deletedAt;