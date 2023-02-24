import { OrderStatusCode } from "src/orders/enums/order-status-code.enum";
import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class OrderStatusesMigration1662480829263 implements MigrationInterface {

    public static readonly tableName = 'order_statuses';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: OrderStatusesMigration1662480829263.tableName,
            columns: [
                {
                    name: 'code',
                    type: 'varchar',
                    length: '7',
                    isPrimary: true,
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'color',
                    type: 'varchar',
                },
            ],
        }));

        await queryRunner.query(`
            INSERT INTO \`${OrderStatusesMigration1662480829263.tableName}\`
                (\`code\`, \`name\`, \`color\`)
            VALUES
                ('${OrderStatusCode.PENDING}', 'pending', '#f0e518'),
                ('${OrderStatusCode.REJECTED}', 'rejected', '#b81616'),
                ('${OrderStatusCode.COMPLETED}', 'completed', '#119608')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(OrderStatusesMigration1662480829263.tableName);
    }

}
