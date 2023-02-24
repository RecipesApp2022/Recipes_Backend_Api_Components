import {MigrationInterface, QueryRunner, Table} from "typeorm";
import id from "../columns/id";
import { PlansMigration1653679992221 } from "./1653679992221-PlansMigration";

export class PlanImagesMigration1653680821676 implements MigrationInterface {

    public static readonly tableName = 'plan_images';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: PlanImagesMigration1653680821676.tableName,
            columns: [
                id,
                {
                    name: 'path',
                    type: 'varchar',
                },
                {
                    name: 'plan_id',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['plan_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: PlansMigration1653679992221.tableName,
                    onDelete: 'CASCADE',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(PlanImagesMigration1653680821676.tableName);
    }

}
