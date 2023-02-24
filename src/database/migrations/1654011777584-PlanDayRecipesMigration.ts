import {MigrationInterface, QueryRunner, Table} from "typeorm";
import id from "../columns/id";
import { MealPeriodsMigration1652472801117 } from "./1652472801117-MealPeriodsMigration";
import { RecipesMigration1652967102617 } from "./1652967102617-RecipesMigration";
import { PlanDaysMigration1654009361067 } from "./1654009361067-PlanDaysMigration";

export class PlanDayRecipesMigration1654011777584 implements MigrationInterface {

    public static readonly tableName = 'plan_days_recipes';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: PlanDayRecipesMigration1654011777584.tableName,
            columns: [
                id,
                {
                    name: 'plan_day_id',
                    type: 'int',
                },
                {
                    name: 'recipe_id',
                    type: 'int',
                },
                {
                    name: 'meal_period_id',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['plan_day_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: PlanDaysMigration1654009361067.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['recipe_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: RecipesMigration1652967102617.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['meal_period_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: MealPeriodsMigration1652472801117.tableName,
                    onDelete: 'CASCADE',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(PlanDayRecipesMigration1654011777584.tableName);
    }

}
