import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";
import { ClientsMigration1652215551150 } from "./1652215551150-ClientsMigration";
import { PlansMigration1653679992221 } from "./1653679992221-PlansMigration";

export class AddClientIdColumnToPlansMigration1661524856458 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(PlansMigration1653679992221.tableName, 'seller_id', new TableColumn({
            name: 'seller_id',
            type: 'int',
            isNullable: true,
        }));
        
        await queryRunner.addColumn(PlansMigration1653679992221.tableName, new TableColumn({
            name: 'client_id',
            type: 'int',
            isNullable: true,
        }));

        await queryRunner.createForeignKey(PlansMigration1653679992221.tableName, new TableForeignKey({
            columnNames: ['client_id'],
            referencedColumnNames: ['user_id'],
            referencedTableName: ClientsMigration1652215551150.tableName,
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(PlansMigration1653679992221.tableName, 'seller_id', new TableColumn({
            name: 'seller_id',
            type: 'int',
            isNullable: false,
        }));

        const table = await queryRunner.getTable(PlansMigration1653679992221.tableName);
        
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('client_id') !== -1,
        );
        
        await queryRunner.dropForeignKey(PlansMigration1653679992221.tableName, foreignKey);

        await queryRunner.dropColumn(PlansMigration1653679992221.tableName, 'client_id');
    }

}
