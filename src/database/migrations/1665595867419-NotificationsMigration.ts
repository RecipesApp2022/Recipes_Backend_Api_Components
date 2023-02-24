import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { UsersMigration1651853413104 } from "./1651853413104-UsersMigration";

export class NotificationsMigration1665595867419 implements MigrationInterface {

    public static readonly tableName = 'notifications';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: NotificationsMigration1665595867419.tableName,
            columns: [
                id,
                {
                    name: 'message',
                    type: 'varchar',
                },
                {
                    name: 'type',
                    type: 'varchar',
                },
                {
                    name: 'additional_data',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'read_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'user_id',
                    type: 'int',
                },
                createdAt,
                updatedAt,
            ],
            foreignKeys: [
                {
                    columnNames: ['user_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: UsersMigration1651853413104.tableName,
                    onDelete: 'CASCADE',
                },
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(NotificationsMigration1665595867419.tableName);
    }

}
