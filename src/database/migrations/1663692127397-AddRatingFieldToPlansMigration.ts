import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { PlansMigration1653679992221 } from "./1653679992221-PlansMigration";

export class AddRatingFieldToPlansMigration1663692127397 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(PlansMigration1653679992221.tableName, new TableColumn({
            name: 'rating',
            type: 'tinyint',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(PlansMigration1653679992221.tableName, 'rating');
    }

}
