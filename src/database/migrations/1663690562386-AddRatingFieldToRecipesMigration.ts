import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { RecipesMigration1652967102617 } from "./1652967102617-RecipesMigration";

export class AddRatingFieldToRecipesMigration1663690562386 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(RecipesMigration1652967102617.tableName, new TableColumn({
            name: 'rating',
            type: 'tinyint',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(RecipesMigration1652967102617.tableName, 'rating');
    }

}
