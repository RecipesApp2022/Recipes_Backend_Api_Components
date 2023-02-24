import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";

export class SavedMigration1656613066963 implements MigrationInterface {

    public static readonly tableName = 'saved';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: SavedMigration1656613066963.tableName,
            columns: [
                id,
                {
                    name: 'type',
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
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(SavedMigration1656613066963.tableName);
    }

}
