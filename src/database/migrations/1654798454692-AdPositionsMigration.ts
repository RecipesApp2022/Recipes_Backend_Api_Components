import {MigrationInterface, QueryRunner, Table} from "typeorm";
import id from "../columns/id";

export class AdPositionsMigration1654798454692 implements MigrationInterface {

    public static readonly tableName = 'ad_positions';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: AdPositionsMigration1654798454692.tableName,
            columns: [
                id,
                {
                    name: 'name',
                    type: 'varchar',
                },
            ],
            uniques: [
                {
                    columnNames: ['name'],
                },
            ],
        }));

        await queryRunner.query(`
            INSERT INTO \`${AdPositionsMigration1654798454692.tableName}\`
                (\`name\`)
            VALUES
                ('home-popular-meals')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(AdPositionsMigration1654798454692.tableName);
    }

}
