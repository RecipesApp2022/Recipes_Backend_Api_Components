import {MigrationInterface, QueryRunner, Table} from "typeorm";
import id from "../columns/id";
import { PlansMigration1653679992221 } from "./1653679992221-PlansMigration";

export class PlanDaysMigration1654009361067 implements MigrationInterface {

    public static readonly tableName = 'plan_days';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: PlanDaysMigration1654009361067.tableName,
            columns: [
                id,
                {
                    name: 'day_number',
                    type: 'int',
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
        await queryRunner.dropTable(PlanDaysMigration1654009361067.tableName);
    }

}
