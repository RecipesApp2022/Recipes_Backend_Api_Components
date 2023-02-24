import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { SellersMigration1651861624218 } from "./1651861624218-SellersMigration";
import { OccupationsMigration1652816376221 } from "./1652816376221-OccupationsMigration";

export class OccupationSellerMigration1652893298969 implements MigrationInterface {

    public static readonly tableName = 'occupation_seller';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: OccupationSellerMigration1652893298969.tableName,
            columns: [
                {
                    name: 'occupation_id',
                    type: 'int',
                },
                {
                    name: 'seller_id',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['occupation_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: OccupationsMigration1652816376221.tableName,
                },
                {
                    columnNames: ['seller_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: SellersMigration1651861624218.tableName,
                },
            ],
            uniques: [
                {
                    columnNames: ['occupation_id', 'seller_id'],
                },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(OccupationSellerMigration1652893298969.tableName);
    }

}
