import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { UserStatusesMigration1651853413103 } from "./1651853413103-UserStatusesMigration";

export class AddColorToUserStatusMigration1652378674049 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(UserStatusesMigration1651853413103.tableName, new TableColumn({
            name: 'color',
            type: 'varchar',
            length: '50',
            default: "'#ffffff'",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(UserStatusesMigration1651853413103.tableName, 'color');
    }

}
