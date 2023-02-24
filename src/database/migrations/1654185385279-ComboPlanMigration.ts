import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { PlansMigration1653679992221 } from "./1653679992221-PlansMigration";
import { CombosMigration1654123467552 } from "./1654123467552-CombosMigration";

export class ComboPlanMigration1654185385279 implements MigrationInterface {

    public static readonly tableName = 'combo_plan';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: ComboPlanMigration1654185385279.tableName,
            columns: [
                {
                    name: 'combo_id',
                    type: 'int',
                },
                {
                    name: 'plan_id',
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
                {
                    columnNames: ['plan_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: PlansMigration1653679992221.tableName,
                    onDelete: 'CASCADE',
                },
            ],
            uniques: [
                {
                    columnNames: ['combo_id', 'plan_id'],
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(ComboPlanMigration1654185385279.tableName);
    }

}
