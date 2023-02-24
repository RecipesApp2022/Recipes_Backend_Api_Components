import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { RecipesMigration1652967102617 } from "./1652967102617-RecipesMigration";
import { CombosMigration1654123467552 } from "./1654123467552-CombosMigration";

export class ComboRecipeMigration1654185047344 implements MigrationInterface {

    public static readonly tableName = 'combo_recipe';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: ComboRecipeMigration1654185047344.tableName,
            columns: [
                {
                    name: 'combo_id',
                    type: 'int',
                },
                {
                    name: 'recipe_id',
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
                    columnNames: ['recipe_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: RecipesMigration1652967102617.tableName,
                    onDelete: 'CASCADE',
                },
            ],
            uniques: [
                {
                    columnNames: ['combo_id', 'recipe_id'],
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(ComboRecipeMigration1654185047344.tableName);
    }

}
