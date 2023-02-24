import {MigrationInterface, QueryRunner, Table} from "typeorm";
import id from "../columns/id";
import { RecipesMigration1652967102617 } from "./1652967102617-RecipesMigration";

export class RecipeStepsMigration1653320854516 implements MigrationInterface {

    public static readonly tableName = 'recipe_steps';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: RecipeStepsMigration1653320854516.tableName,
            columns: [
                id,
                {
                    name: 'content',
                    type: 'text',
                },
                {
                    name: 'order',
                    type: 'int',
                },
                {
                    name: 'recipe_id',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['recipe_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: RecipesMigration1652967102617.tableName,
                    onDelete: 'CASCADE',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(RecipeStepsMigration1653320854516.tableName);
    }

}
