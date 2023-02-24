import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { CategoriesMigration1652383834009 } from "./1652383834009-CategoriesMigration";
import { PlansMigration1653679992221 } from "./1653679992221-PlansMigration";

export class CategoryPlanMigration1653681256652 implements MigrationInterface {

    public static readonly tableName = 'category_plan';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: CategoryPlanMigration1653681256652.tableName,
            columns: [
                {
                    name: 'category_id',
                    type: 'int',
                },
                {
                    name: 'plan_id',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['category_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: CategoriesMigration1652383834009.tableName,
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
                    columnNames: ['category_id', 'plan_id'],         
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(CategoryPlanMigration1653681256652.tableName);
    }

}
