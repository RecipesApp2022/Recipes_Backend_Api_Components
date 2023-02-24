import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import createdAt from '../columns/created-at';
import id from '../columns/id';
import updatedAt from '../columns/updated-at';
import { ClientsMigration1652215551150 } from './1652215551150-ClientsMigration';

export class ShoppingListsMigration1675364140645 implements MigrationInterface {
  public static tableName = 'shopping-lists';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: ShoppingListsMigration1675364140645.tableName,
        columns: [
          id,
          {
            type: 'varchar',
            name: 'name',
          },
          {
            type: 'varchar',
            name: 'path',
          },
          {
            type: 'int',
            name: 'client_id',
          },
          createdAt,
          updatedAt,
        ],
        foreignKeys: [
          {
            columnNames: ['client_id'],
            referencedColumnNames: ['user_id'],
            referencedTableName: ClientsMigration1652215551150.tableName,
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(ShoppingListsMigration1675364140645.tableName);
  }
}
