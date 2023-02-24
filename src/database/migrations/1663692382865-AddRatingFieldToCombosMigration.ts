import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { CombosMigration1654123467552 } from "./1654123467552-CombosMigration";

export class AddRatingFieldToCombosMigration1663692382865 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(CombosMigration1654123467552.tableName, new TableColumn({
            name: 'rating',
            type: 'tinyint',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(CombosMigration1654123467552.tableName, 'rating');
    }

}
