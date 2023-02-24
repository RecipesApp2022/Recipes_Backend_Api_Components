import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { SellersMigration1651861624218 } from "./1651861624218-SellersMigration";
import { AdPositionsMigration1654798454692 } from "./1654798454692-AdPositionsMigration";

export class AdsMigration1655128981877 implements MigrationInterface {

    public static readonly tableName = 'ads';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: AdsMigration1655128981877.tableName,
            columns: [
                id,
                {
                    name: 'img_path',
                    type: 'varchar',
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'description',
                    type: 'text',
                },
                {
                    name: 'url',
                    type: 'varchar',
                },
                {
                    name: 'priority',
                    type: 'int',
                },
                {
                    name: 'from',
                    type: 'datetime',
                },
                {
                    name: 'until',
                    type: 'datetime',
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 14,
                    scale: 2,
                },
                {
                    name: 'seller_id',
                    type: 'int',
                },
                {
                    name: 'ad_position_id',
                    type: 'int',
                },
                createdAt,
                updatedAt,
                deletedAt,
            ],
            foreignKeys: [
                {
                    columnNames: ['seller_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: SellersMigration1651861624218.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['ad_position_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: AdPositionsMigration1654798454692.tableName,
                    onDelete: 'CASCADE',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(AdsMigration1655128981877.tableName);
    }

}
