import { TableColumnOptions } from "typeorm";

const id: TableColumnOptions = {
    name: 'id',
    type: 'int',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
}

export default id;