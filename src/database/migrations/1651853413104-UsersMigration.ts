import { Role } from "src/users/enums/role.enum";
import { UserStatusCode } from "src/users/enums/user-status-code.enum";
import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { UserStatusesMigration1651853413103 } from "./1651853413103-UserStatusesMigration";

export class UsersMigration1651853413104 implements MigrationInterface {

    public static readonly tableName = 'users';
    
    public async up(queryRunner: QueryRunner): Promise<void> {        
        await queryRunner.createTable(new Table({
            name: UsersMigration1651853413104.tableName,
            columns: [
                id,
                {
                    name: 'email',
                    type: 'varchar',
                    length: '150',
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'role',
                    type: 'varchar',
                    length: '20',
                },
                {
                    name: 'user_status_code',
                    type: 'varchar',
                    length: '7',
                },
                createdAt,
                updatedAt,
                deletedAt,
            ],
            foreignKeys: [
                {
                    columnNames: ['user_status_code'],
                    referencedColumnNames: ['code'],
                    referencedTableName: UserStatusesMigration1651853413103.tableName,
                    onDelete: 'CASCADE',
                }
            ]
        }));

        await queryRunner.query(`
            INSERT INTO \`${UsersMigration1651853413104.tableName}\` (\`email\`, \`password\`, \`role\`, \`user_status_code\`)
            VALUES
                ('admin@admin.com', '$2b$10$mEwACiL/vK10BYiyjucUAOSrGDJaLd3CP.f6xEdk.LAVahZFcthqy', '${Role.ADMIN}', '${UserStatusCode.ACTIVE}'),
                ('client@client.com', '$2b$10$mEwACiL/vK10BYiyjucUAOSrGDJaLd3CP.f6xEdk.LAVahZFcthqy', '${Role.CLIENT}', '${UserStatusCode.ACTIVE}'),
                ('italianrestaurant@gmail.com', '$2b$10$mEwACiL/vK10BYiyjucUAOSrGDJaLd3CP.f6xEdk.LAVahZFcthqy', '${Role.SELLER}', '${UserStatusCode.ACTIVE}')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(UsersMigration1651853413104.tableName);
    }

}
