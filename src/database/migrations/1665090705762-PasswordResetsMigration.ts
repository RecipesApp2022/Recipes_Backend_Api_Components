import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";

export class PasswordResetsMigration1665090705762 implements MigrationInterface {

    public static readonly tableName = 'password_resets';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: PasswordResetsMigration1665090705762.tableName,
            columns: [
                id,
                {
                    name: 'token',
                    type: 'varchar',
                },
                {
                    name: 'email',
                    type: 'varchar',
                },
                createdAt,
                updatedAt,
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(PasswordResetsMigration1665090705762.tableName);
    }

}
