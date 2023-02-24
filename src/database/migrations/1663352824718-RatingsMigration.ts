import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { ClientsMigration1652215551150 } from "./1652215551150-ClientsMigration";

export class RatingsMigration1663352824718 implements MigrationInterface {

    public static readonly tableName = 'ratings';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: RatingsMigration1663352824718.tableName,
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
                    name: 'item_id',
                    type: 'int',
                },
                {
                    name: 'item_type',
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
                    columnNames: ['item_id', 'item_type', 'client_id'],
                },
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(RatingsMigration1663352824718.tableName);
    }

}
