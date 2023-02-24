import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { UsersMigration1651853413104 } from "./1651853413104-UsersMigration";

export class AdminsMigration1652215227951 implements MigrationInterface {

    public static readonly tableName = 'admins';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: AdminsMigration1652215227951.tableName,
            columns: [
                {
                    name: 'user_id',
                    type: 'int',
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'phone_number',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'address',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'img_path',
                    type: 'varchar',
                    isNullable: true,
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['user_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: UsersMigration1651853413104.tableName,
                    onDelete: 'CASCADE',
                }
            ]
        }));

        await queryRunner.query(`
            INSERT INTO \`${AdminsMigration1652215227951.tableName}\` (\`user_id\`, \`name\`, \`phone_number\`, \`address\`)
            VALUES (1, 'Alexis Navarro', '+584261249733', 'Los Guayos II Manzana f5 casa 6')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(AdminsMigration1652215227951.tableName);
    }

}
