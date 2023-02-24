import { TableColumnOptions } from "typeorm";

const createdAt: TableColumnOptions = {
    name: 'created_at',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP()',
}

export default createdAt;