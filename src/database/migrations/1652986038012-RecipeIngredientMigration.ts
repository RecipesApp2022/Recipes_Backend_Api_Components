import {MigrationInterface, QueryRunner, Table} from "typeorm";
import id from "../columns/id";
import { MeasurementUnitsMigration1652327347069 } from "./1652327347069-MeasurementUnitsMigration";
import { IngredientsMigration1652479309805 } from "./1652479309805-IngredientsMigration";
import { RecipesMigration1652967102617 } from "./1652967102617-RecipesMigration";

export class RecipeIngredientMigration1652986038012 implements MigrationInterface {

    public static readonly tableName = 'ingredient_recipe';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: RecipeIngredientMigration1652986038012.tableName,
            columns: [
                id,
                {
                    name: 'value',
                    type: 'float',
                },
                {
                    name: 'ingredient_id',
                    type: 'int',
                },
                {
                    name: 'recipe_id',
                    type: 'int',
                },
                {
                    name: 'measurement_unit_id',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['ingredient_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: IngredientsMigration1652479309805.tableName,
                },
                {
                    columnNames: ['recipe_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: RecipesMigration1652967102617.tableName,
                },
                {
                    columnNames: ['measurement_unit_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: MeasurementUnitsMigration1652327347069.tableName,
                },
            ],
            uniques: [
                {
                    columnNames: ['ingredient_id', 'recipe_id'],
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(RecipeIngredientMigration1652986038012.tableName);
    }

}
