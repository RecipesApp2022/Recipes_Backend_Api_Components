import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { ClientsMigration1652215551150 } from "./1652215551150-ClientsMigration";
import { RecipesMigration1652967102617 } from "./1652967102617-RecipesMigration";
import { PlansMigration1653679992221 } from "./1653679992221-PlansMigration";
import { CombosMigration1654123467552 } from "./1654123467552-CombosMigration";

export class FavoritesMigration1655240997961 implements MigrationInterface {

    public static readonly tableName = 'favorites';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: FavoritesMigration1655240997961.tableName,
            columns: [
                id,                
                {
                    name: 'type',
                    type: 'varchar',
                },
                {
                    name: 'reaction',
                    type: 'varchar',
                },
                {
                    name: 'client_id',
                    type: 'int',
                },
                {
                    name: 'recipe_id',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'plan_id',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'combo_id',
                    type: 'int',
                    isNullable: true,
                },
                createdAt,
                updatedAt,
            ],
            foreignKeys: [
                {
                    columnNames: ['client_id'],
                    referencedColumnNames: ['user_id'],
                    referencedTableName: ClientsMigration1652215551150.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['recipe_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: RecipesMigration1652967102617.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['plan_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: PlansMigration1653679992221.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['combo_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: CombosMigration1654123467552.tableName,
                    onDelete: 'CASCADE',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(FavoritesMigration1655240997961.tableName);
    }

}
