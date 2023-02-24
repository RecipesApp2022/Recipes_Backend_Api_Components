import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { SellersMigration1651861624218 } from "./1651861624218-SellersMigration";
import { ClientsMigration1652215551150 } from "./1652215551150-ClientsMigration";
import { OrdersMigration1662480829264 } from "./1662480829264-OrdersMigration";

export class SellerRatingsMigration1664304797288 implements MigrationInterface {

    public static readonly tableName = 'seller_ratings';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: SellerRatingsMigration1664304797288.tableName,
            columns: [
                id,
                {
                    name: 'value',
                    type: 'int',
                },
                {
                    name: 'comment',
                    type: 'text',
                    length: '512',
                    isNullable: true,
                },
                {
                    name: 'is_edited',
                    type: 'tinyint',
                    default: 0,
                },
                {
                    name: 'seller_id',
                    type: 'int',
                },
                {
                    name: 'client_id',
                    type: 'int',
                },
                {
                    name: 'order_id',
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
                {
                    columnNames: ['seller_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: SellersMigration1651861624218.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['order_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: OrdersMigration1662480829264.tableName,
                    onDelete: 'CASCADE',
                },
            ],
            uniques: [
                {
                    columnNames: ['seller_id', 'client_id', 'order_id'],
                },
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(SellersMigration1651861624218.tableName);
    }

}
