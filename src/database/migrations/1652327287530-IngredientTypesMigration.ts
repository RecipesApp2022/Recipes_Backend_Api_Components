import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";

export class IngredientTypesMigration1652327287530 implements MigrationInterface {

    public static readonly tableName = 'ingredient_types';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: IngredientTypesMigration1652327287530.tableName,
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
            INSERT INTO \`${IngredientTypesMigration1652327287530.tableName}\`
                (\`name\`)
            VALUES
                ('Fridge'),
                ('Pantry')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(IngredientTypesMigration1652327287530.tableName);
    }

}
