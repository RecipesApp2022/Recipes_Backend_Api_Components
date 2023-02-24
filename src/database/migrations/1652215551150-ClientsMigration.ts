import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { UsersMigration1651853413104 } from "./1651853413104-UsersMigration";

export class ClientsMigration1652215551150 implements MigrationInterface {

    public static readonly tableName = 'clients';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: ClientsMigration1652215551150.tableName,
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
            INSERT INTO \`${ClientsMigration1652215551150.tableName}\` (\`user_id\`, \`name\`, \`phone_number\`)
            VALUES (2, 'Alexis Navarro', '+584261249733')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
