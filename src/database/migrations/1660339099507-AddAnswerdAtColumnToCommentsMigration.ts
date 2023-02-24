import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { CommentsMigration1659733435894 } from "./1659733435894-CommentsMigration";

export class AddAnswerdAtColumnToCommentsMigration1660339099507 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(CommentsMigration1659733435894.tableName, new TableColumn({
            name: 'answered_at',
            type: 'timestamp',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(CommentsMigration1659733435894.tableName, 'answered_at');
    }

}
