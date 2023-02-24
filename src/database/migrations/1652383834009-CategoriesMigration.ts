import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";

export class CategoriesMigration1652383834009 implements MigrationInterface {

    public static readonly tableName = 'categories';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: CategoriesMigration1652383834009.tableName,
            columns: [
                id,
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'banner',
                    type: 'varchar',
                },
                {
                    name: 'app_logo',
                    type: 'varchar',
                },
                createdAt,
                updatedAt,
                deletedAt,
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(CategoriesMigration1652383834009.tableName);
    }

}
