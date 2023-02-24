import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { MealPeriodsMigration1652472801117 } from "./1652472801117-MealPeriodsMigration";
import { RecipesMigration1652967102617 } from "./1652967102617-RecipesMigration";

export class MealPeriodRecipeMigration1652969524137 implements MigrationInterface {

    public static readonly tableName = 'meal_period_recipe';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: MealPeriodRecipeMigration1652969524137.tableName,
            columns: [
                {
                    name: 'meal_period_id',
                    type: 'int',
                },
                {
                    name: 'recipe_id',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['meal_period_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: MealPeriodsMigration1652472801117.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['recipe_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: RecipesMigration1652967102617.tableName,
                    onDelete: 'CASCADE',
                },
            ],
            uniques: [
                {
                    columnNames: ['meal_period_id', 'recipe_id'],
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(MealPeriodRecipeMigration1652969524137.tableName);
    }

}
