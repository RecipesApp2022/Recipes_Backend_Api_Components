import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { CategoriesMigration1652383834009 } from "./1652383834009-CategoriesMigration";
import { RecipesMigration1652967102617 } from "./1652967102617-RecipesMigration";

export class CategoryRecipeMigration1652967914961 implements MigrationInterface {

    public static readonly tableName = 'category_recipe';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: CategoryRecipeMigration1652967914961.tableName,
            columns: [
                {
                    name: 'category_id',
                    type: 'int',
                },
                {
                    name: 'recipe_id',
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
                    columnNames: ['recipe_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: RecipesMigration1652967102617.tableName,
                    onDelete: 'CASCADE',
                },
            ],
            uniques: [
                {
                    columnNames: ['category_id', 'recipe_id'],                    
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(CategoryRecipeMigration1652967914961.tableName);
    }

}
