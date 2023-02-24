import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { SellersMigration1651861624218 } from "./1651861624218-SellersMigration";
import { ClientsMigration1652215551150 } from "./1652215551150-ClientsMigration";

export class ChatsMigration1660683792492 implements MigrationInterface {

    public static readonly tableName = 'chats';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: ChatsMigration1660683792492.tableName,
            columns: [
                id,
                {
                    name: 'client_id',
                    type: 'int',
                },
                {
                    name: 'seller_id',
                    type: 'int',
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
                {
                    columnNames: ['seller_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: SellersMigration1651861624218.tableName,
                    onDelete: 'CASCADE',
                },
            ],
            uniques: [
                {
                    columnNames: ['client_id', 'seller_id'],
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(ChatsMigration1660683792492.tableName);
    }

}
