import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import createdAt from '../columns/created-at';
import id from '../columns/id';
import updatedAt from '../columns/updated-at';
import { MessagesMigration1660698064395 } from './1660698064395-MessagesMigration';

export class MessageAttachmentsMigration1674486453224
  implements MigrationInterface
{
  public static readonly tableName = 'message_attachments';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: MessageAttachmentsMigration1674486453224.tableName,
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
            name: 'message_id',
          },
          createdAt,
          updatedAt,
        ],
        foreignKeys: [
          {
            columnNames: ['message_id'],
            referencedTableName: MessagesMigration1660698064395.tableName,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      MessageAttachmentsMigration1674486453224.tableName,
    );
  }
}
