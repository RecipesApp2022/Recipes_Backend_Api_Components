import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { ClientsMigration1652215551150 } from "./1652215551150-ClientsMigration";

export class AddSeveralFieldsToClientsMigration1653942935802 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns(ClientsMigration1652215551150.tableName, [
            new TableColumn({
                name: 'instagram',
                type: 'varchar',
                isNullable: true
            }),
            new TableColumn({
                name: 'paypal',
                type: 'varchar',
                isNullable: true
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns(ClientsMigration1652215551150.tableName, ['paypal', 'instagram']);
    }

}
