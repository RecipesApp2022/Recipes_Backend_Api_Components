import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { RecipeImagesMigration1652970120308 } from "./1652970120308-RecipeImagesMigration";

export class RemoveFieldsFromRecipeImagesMigration1653418985810 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns(RecipeImagesMigration1652970120308.tableName, ['is_portrait', 'position']);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns(RecipeImagesMigration1652970120308.tableName, [
            new TableColumn({
                name: 'is_portrait',
                type: 'tinyint',
            }),
            new TableColumn({
                name: 'position',
                type: 'int',
            }),
        ]);
    }

}
