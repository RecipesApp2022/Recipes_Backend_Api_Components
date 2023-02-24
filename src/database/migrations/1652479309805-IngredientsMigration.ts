import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { IngredientTypesMigration1652327287530 } from "./1652327287530-IngredientTypesMigration";

export class IngredientsMigration1652479309805 implements MigrationInterface {

    public static readonly tableName = 'ingredients';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: IngredientsMigration1652479309805.tableName,
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
                {
                    name: 'ingredient_type_id',
                    type: 'int',
                },
                createdAt,
                updatedAt,
                deletedAt,
            ],
            foreignKeys: [
                {
                    columnNames: ['ingredient_type_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: IngredientTypesMigration1652327287530.tableName,
                    onDelete: 'CASCADE',
                }
            ]
        }));

        const fridgeTypeId = 1;
        const pantryTypeId = 2;
        
        await queryRunner.query(`
            INSERT INTO \`${IngredientsMigration1652479309805.tableName}\`
                (\`name\`, \`icon\`, \`ingredient_type_id\`)
            VALUES
                ('Onion', 'uploads/ingredients/onion.png', ${fridgeTypeId}),
                ('Chilli Pepper', 'uploads/ingredients/chilli-peppers.png', ${fridgeTypeId}),
                ('Chicken breast', 'uploads/ingredients/chicken-breast.png', ${fridgeTypeId}),
                ('Ground beef', 'uploads/ingredients/ground-beef.png', ${fridgeTypeId}),
                ('Tomato', 'uploads/ingredients/tomato.png', ${fridgeTypeId}),

                ('Salt', 'uploads/ingredients/salt.png', ${pantryTypeId}),
                ('Olive oil', 'uploads/ingredients/olive-oil.png', ${pantryTypeId}),
                ('Noodles', 'uploads/ingredients/noodles.png', ${pantryTypeId}),
                ('Rice', 'uploads/ingredients/rice.png', ${pantryTypeId}),
                ('Sugar', 'uploads/ingredients/sugar.png', ${pantryTypeId})
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(IngredientsMigration1652479309805.tableName);
    }

}
