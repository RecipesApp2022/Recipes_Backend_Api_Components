import { OrderStatusCode } from "src/orders/enums/order-status-code.enum";
import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { SellersMigration1651861624218 } from "./1651861624218-SellersMigration";
import { ClientsMigration1652215551150 } from "./1652215551150-ClientsMigration";
import { OrderStatusesMigration1662480829263 } from "./1662480829263-OrderStatusesMigration";

export class OrdersMigration1662480829264 implements MigrationInterface {

    public static readonly tableName = 'orders';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name:  OrdersMigration1662480829264.tableName,
            columns: [
                id,
                {
                    name: 'order_status_code',
                    type: 'varchar',
                    length: '7',
                },
                {
                    name: 'seller_id',
                    type: 'int',
                },
                {
                    name: 'client_id',
                    type: 'int',
                },
                createdAt,
                updatedAt,
                deletedAt,
            ],
            foreignKeys: [
                {
                    columnNames: ['order_status_code'],
                    referencedColumnNames: ['code'],
                    referencedTableName: OrderStatusesMigration1662480829263.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['seller_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: SellersMigration1651861624218.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['client_id'],
                    referencedColumnNames: ['user_id'],
                    referencedTableName: ClientsMigration1652215551150.tableName,
                    onDelete: 'CASCADE',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(OrdersMigration1662480829264.tableName);
    }

}
