import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { SellersMigration1651861624218 } from "./1651861624218-SellersMigration";

export class PlansMigration1653679992221 implements MigrationInterface {

    public static readonly tableName = 'plans';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: PlansMigration1653679992221.tableName,
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
                    name: 'seller_id',
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
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(PlansMigration1653679992221.tableName);
    }

}
