import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { SellersMigration1651861624218 } from "./1651861624218-SellersMigration";
import { RecipeDifficultiesMigration1652477663062 } from "./1652477663062-RecipeDifficultiesMigration";

export class RecipesMigration1652967102617 implements MigrationInterface {

    public static readonly tableName = 'recipes';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: RecipesMigration1652967102617.tableName,
            columns: [
                id,
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'slug',
                    type: 'varchar',
                },
                {
                    name: 'preparation_time',
                    type: 'int',
                },
                {
                    name: 'description',
                    type: 'longtext',
                },
                {
                    name: 'short_description',
                    type: 'varchar',
                },
                {
                    name: 'is_premium',
                    type: 'tinyint',
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 14,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'number_of_dinners',
                    type: 'int',
                },
                {
                    name: 'seller_id',
                    type: 'int',
                },
                {
                    name: 'recipe_difficulty_id',
                    type: 'int',
                },
                createdAt,
                updatedAt,
                deletedAt,
            ],
            foreignKeys: [
                {
                    columnNames: ['recipe_difficulty_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: RecipeDifficultiesMigration1652477663062.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['seller_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: SellersMigration1651861624218.tableName,
                    onDelete: 'CASCADE',
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(RecipesMigration1652967102617.tableName);
    }

}
