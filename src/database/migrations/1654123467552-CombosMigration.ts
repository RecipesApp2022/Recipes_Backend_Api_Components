import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { SellersMigration1651861624218 } from "./1651861624218-SellersMigration";
import { ComboPurposesMigration1654116963912 } from "./1654116963912-ComboPurposesMigration";

export class CombosMigration1654123467552 implements MigrationInterface {

    public static readonly tableName = 'combos';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: CombosMigration1654123467552.tableName,
            columns: [
                id,
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'slug',
                    type: 'varchar',
                },
                {
                    name: 'description',
                    type: 'text',
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 14,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'combo_purpose_id',
                    type: 'int',
                },
                {
                    name: 'seller_id',
                    type: 'int',
                },
                createdAt,
                updatedAt,
                deletedAt,
            ],
            foreignKeys: [
                {
                    columnNames: ['combo_purpose_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: ComboPurposesMigration1654116963912.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['seller_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: SellersMigration1651861624218.tableName,
                    onDelete: 'CASCADE',
                },
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(CombosMigration1654123467552.tableName);
    }

}
