import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { ClientsMigration1652215551150 } from "./1652215551150-ClientsMigration";

export class PurchasedProductsMigration1663354371612 implements MigrationInterface {

    public static readonly tableName = 'purchased_products';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: PurchasedProductsMigration1663354371612.tableName,
            columns: [
                id,
                {
                    name: 'product_id',
                    type: 'int',
                },
                {
                    name: 'type',
                    type: 'varchar',
                },
                {
                    name: 'client_id',
                    type: 'int',
                },
                createdAt,
                updatedAt,
            ],
            foreignKeys: [
                {
                    columnNames: ['client_id'],
                    referencedColumnNames: ['user_id'],
                    referencedTableName: ClientsMigration1652215551150.tableName,
                    onDelete: 'CASCADE',
                },
            ],
            uniques: [
                {
                    columnNames: ['type', 'product_id', 'client_Id'],
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(PurchasedProductsMigration1663354371612.tableName);
    }

}
