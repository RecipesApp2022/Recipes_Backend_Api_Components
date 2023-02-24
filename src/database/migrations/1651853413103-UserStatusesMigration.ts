import { UserStatusCode } from "src/users/enums/user-status-code.enum";
import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class UserStatusesMigration1651853413103 implements MigrationInterface {

    public static readonly tableName = 'user_statuses';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: UserStatusesMigration1651853413103.tableName,
            columns: [
                {
                    name: 'code',
                    type: 'varchar',
                    length: '7',
                    isPrimary: true,
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
            ]
        }));

        await queryRunner.query(`
            INSERT INTO \`${UserStatusesMigration1651853413103.tableName}\` (\`code\`, \`name\`)
            VALUES
                ('${UserStatusCode.ACTIVE}', 'activo'),
                ('${UserStatusCode.INACTIVE}', 'inactivo'),
                ('${UserStatusCode.BANNED}', 'baneado')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(UserStatusesMigration1651853413103.tableName);
    }

}
