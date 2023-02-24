import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";

export class OccupationsMigration1652816376221 implements MigrationInterface {

    public static readonly tableName = 'occupations';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: OccupationsMigration1652816376221.tableName,
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
            INSERT INTO \`${OccupationsMigration1652816376221.tableName}\`
                (\`name\`)
            VALUES
                ('Chef'),
                ('Nutritionist')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(OccupationsMigration1652816376221.tableName);
    }

}
