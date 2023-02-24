import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";

export class RecipeDifficultiesMigration1652477663062 implements MigrationInterface {

    public static readonly tableName = 'recipe_difficulties';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: RecipeDifficultiesMigration1652477663062.tableName,
            columns: [
                id,
                {
                    name: 'name',
                    type: 'varchar',
                },
                createdAt,
                updatedAt,
                deletedAt,
            ],
        }));

        await queryRunner.query(`
            INSERT INTO \`${RecipeDifficultiesMigration1652477663062.tableName}\`
                (\`name\`)
            VALUES
                ('Easy'),
                ('Medium'),
                ('Difficult')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(RecipeDifficultiesMigration1652477663062.tableName);
    }

}
