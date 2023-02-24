import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { RecipeIngredientMigration1652986038012 } from "./1652986038012-RecipeIngredientMigration";

export class AddOnlyPremiunColumnToRecipeIngredientMigration1659030604102 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(RecipeIngredientMigration1652986038012.tableName, new TableColumn({
            name: 'only_premium',
            type: 'tinyint',
            default: 0,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(RecipeIngredientMigration1652986038012.tableName, 'only_premium');
    }

}
