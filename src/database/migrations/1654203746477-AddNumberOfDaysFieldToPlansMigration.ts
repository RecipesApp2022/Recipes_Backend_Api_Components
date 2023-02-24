import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { PlansMigration1653679992221 } from "./1653679992221-PlansMigration";

export class AddNumberOfDaysFieldToPlansMigration1654203746477 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(PlansMigration1653679992221.tableName, new TableColumn({
            name: 'number_of_days',
            type: 'int',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(PlansMigration1653679992221.tableName, 'number_of_days');
    }

}
