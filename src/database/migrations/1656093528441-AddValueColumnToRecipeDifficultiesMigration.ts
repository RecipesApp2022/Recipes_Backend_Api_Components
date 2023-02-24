import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { RecipeDifficultiesMigration1652477663062 } from "./1652477663062-RecipeDifficultiesMigration";

export class AddValueColumnToRecipeDifficultiesMigration1656093528441 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(RecipeDifficultiesMigration1652477663062.tableName, new TableColumn({
            name: 'value',
            type: 'int',
        }));

        await queryRunner.query(`UPDATE \`${RecipeDifficultiesMigration1652477663062.tableName}\` SET \`value\` = 1 WHERE name = 'Easy'`);
        await queryRunner.query(`UPDATE \`${RecipeDifficultiesMigration1652477663062.tableName}\` SET \`value\` = 2 WHERE name = 'Medium'`);
        await queryRunner.query(`UPDATE \`${RecipeDifficultiesMigration1652477663062.tableName}\` SET \`value\` = 3 WHERE name = 'Difficult'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(RecipeDifficultiesMigration1652477663062.tableName, 'value');
    }

}
