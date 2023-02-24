import {MigrationInterface, QueryRunner, Table} from "typeorm";
import id from "../columns/id";
import { RecipesMigration1652967102617 } from "./1652967102617-RecipesMigration";

export class RecipeVideosMigration1652973115070 implements MigrationInterface {

    public static readonly tableName = 'recipe_videos';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: RecipeVideosMigration1652973115070.tableName,
            columns: [
                id,
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'url',
                    type: 'varchar',
                },
                {
                    name: 'is_recipe_cover',
                    type: 'tinyint',
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
        await queryRunner.dropTable(RecipeVideosMigration1652973115070.tableName);
    }

}
