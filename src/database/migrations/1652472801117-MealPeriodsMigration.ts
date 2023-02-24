import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";

export class MealPeriodsMigration1652472801117 implements MigrationInterface {

    public static readonly tableName = 'meal_periods';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: MealPeriodsMigration1652472801117.tableName,
            columns: [
                id,
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'icon',
                    type: 'varchar',
                },
                createdAt,
                updatedAt,
                deletedAt,
            ]
        }));

        await queryRunner.query(`
            INSERT INTO \`${MealPeriodsMigration1652472801117.tableName}\`
                (\`name\`, \`icon\`)
            VALUES
                ('Breakfast', 'uploads/meal-periods/breakfast.png'),
                ('Lunch', 'uploads/meal-periods/lunch.png'),
                ('Snacks', 'uploads/meal-periods/snacks.png'),
                ('Dinner', 'uploads/meal-periods/dinner.png')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(MealPeriodsMigration1652472801117.tableName);
    }

}
