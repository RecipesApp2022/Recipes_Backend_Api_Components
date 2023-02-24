import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { UsersMigration1651853413104 } from "./1651853413104-UsersMigration";
import { ChatsMigration1660683792492 } from "./1660683792492-ChatsMigration";

export class MessagesMigration1660698064395 implements MigrationInterface {

    public static readonly tableName = 'messages';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: MessagesMigration1660698064395.tableName,
            columns: [
                id,
                {
                    name: 'content',
                    type: 'varchar',
                },
                {
                    name: 'is_read',
                    type: 'tinyint',
                    default: 0,
                },
                {
                    name: 'chat_id',
                    type: 'int',
                },
                {
                    name: 'user_id',
                    type: 'int',
                },
                createdAt,
                updatedAt,
            ],
            foreignKeys: [
                {
                    columnNames: ['chat_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: ChatsMigration1660683792492.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['user_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: UsersMigration1651853413104.tableName,
                    onDelete: 'CASCADE',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(MessagesMigration1660698064395.tableName);
    }

}
