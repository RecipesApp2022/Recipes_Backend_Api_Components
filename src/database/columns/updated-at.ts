import { TableColumnOptions } from "typeorm";

const updatedAt: TableColumnOptions = {
    name: 'updated_at',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP()',
}

export default updatedAt;