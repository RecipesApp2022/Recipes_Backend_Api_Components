import {MigrationInterface, QueryRunner, Table} from "typeorm";
import id from "../columns/id";
import { RecipesMigration1652967102617 } from "./1652967102617-RecipesMigration";

export class RecipeImagesMigration1652970120308 implements MigrationInterface {

    public static readonly tableName = 'recipe_images';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: RecipeImagesMigration1652970120308.tableName,
            columns: [
                id,
                {
                    name: 'path',
                    type: 'varchar',
                },
                {
                    name: 'is_portrait',
                    type: 'tinyint',
                },
                {
                    name: 'position',
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
        await queryRunner.dropTable(RecipeImagesMigration1652970120308.tableName);
    }

}
