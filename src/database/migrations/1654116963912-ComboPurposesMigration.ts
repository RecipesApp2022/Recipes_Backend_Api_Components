import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";

export class ComboPurposesMigration1654116963912 implements MigrationInterface {

    public static readonly tableName = 'combo_purposes';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: ComboPurposesMigration1654116963912.tableName,
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
            INSERT INTO \`${ComboPurposesMigration1654116963912.tableName}\`
                (\`name\`)
            VALUES
                ('Time saving')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(ComboPurposesMigration1654116963912.tableName);
    }

}
