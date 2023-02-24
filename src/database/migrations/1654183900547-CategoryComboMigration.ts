import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { CategoriesMigration1652383834009 } from "./1652383834009-CategoriesMigration";
import { CombosMigration1654123467552 } from "./1654123467552-CombosMigration";

export class CategoryComboMigration1654183900547 implements MigrationInterface {

    public static readonly tableName = 'category_combo';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: CategoryComboMigration1654183900547.tableName,
            columns: [
                {
                    name: 'category_id',
                    type: 'int',
                },
                {
                    name: 'combo_id',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['category_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: CategoriesMigration1652383834009.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['combo_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: CombosMigration1654123467552.tableName,
                    onDelete: 'CASCADE',
                },
            ],
            uniques: [
                {
                    columnNames: ['category_id', 'combo_id'],         
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(CategoryComboMigration1654183900547.tableName);
    }

}
