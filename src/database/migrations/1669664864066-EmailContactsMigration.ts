import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import createdAt from '../columns/created-at';
import id from '../columns/id';
import updatedAt from '../columns/updated-at';

export class EmailContactsMigration1669664864066 implements MigrationInterface {
  public static readonly tableName = 'email_contacts';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: EmailContactsMigration1669664864066.tableName,
        columns: [
          id,
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'text',
            length: '1024',
          },
          createdAt,
          updatedAt,
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(EmailContactsMigration1669664864066.tableName);
  }
}
