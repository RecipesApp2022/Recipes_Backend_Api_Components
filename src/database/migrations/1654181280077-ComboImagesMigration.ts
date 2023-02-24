import {MigrationInterface, QueryRunner, Table} from "typeorm";
import id from "../columns/id";
import { CombosMigration1654123467552 } from "./1654123467552-CombosMigration";

export class ComboImagesMigration1654181280077 implements MigrationInterface {

    public static readonly tableName = 'combo_images';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: ComboImagesMigration1654181280077.tableName,
            columns: [
                id,
                {
                    name: 'path',
                    type: 'varchar',
                },
                {
                    name: 'combo_id',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['combo_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: CombosMigration1654123467552.tableName,
                    onDelete: 'CASCADE',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(ComboImagesMigration1654181280077.tableName);
    }

}
