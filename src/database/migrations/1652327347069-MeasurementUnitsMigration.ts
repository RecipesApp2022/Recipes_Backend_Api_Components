import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";

export class MeasurementUnitsMigration1652327347069 implements MigrationInterface {

    public static readonly tableName = 'measurement_units';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: MeasurementUnitsMigration1652327347069.tableName,
            columns: [
                id,
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'abbreviation',
                    type: 'varchar',
                },
                createdAt,
                updatedAt,
                deletedAt,
            ],
        }));


        await queryRunner.query(`
            INSERT INTO \`${MeasurementUnitsMigration1652327347069.tableName}\`
                (\`name\`, \`abbreviation\`)
            VALUES
                ('Ounce', 'oz'),
                ('Pound', 'lb'),
                ('Cup', 'C'),
                ('Tablespoon', 'Tbsp')
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(MeasurementUnitsMigration1652327347069.tableName);
    }

}
