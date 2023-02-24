import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";

export class PaymentsMigration1663081925449 implements MigrationInterface {

    public static readonly tableName = 'payments';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: PaymentsMigration1663081925449.tableName,
            columns: [
                id,
                {
                    name: 'amount',
                    type: 'decimal',
                    precision: 12,
                    scale: 2,
                },
                {
                    name: 'order_id',
                    type: 'int',
                },
                {
                    name: 'client_id',
                    type: 'int',
                },
                {
                    name: 'payment_method_code',
                    type: 'varchar',
                    length: '7',
                },
                createdAt,
                updatedAt,
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(PaymentsMigration1663081925449.tableName);
    }

}
