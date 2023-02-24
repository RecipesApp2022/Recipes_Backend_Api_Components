import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { ClientsMigration1652215551150 } from "./1652215551150-ClientsMigration";
import { RecipesMigration1652967102617 } from "./1652967102617-RecipesMigration";
import { PlansMigration1653679992221 } from "./1653679992221-PlansMigration";

export class EventsMigration1660858260323 implements MigrationInterface {

    public static readonly tableName = 'events';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: EventsMigration1660858260323.tableName,
            columns: [
                id,
                {
                    name: 'start',
                    type: 'date',
                },
                {
                    name: 'end',
                    type: 'date',
                },
                {
                    name: 'client_id',
                    type: 'int',
                },
                {
                    name: 'recipe_id',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'plan_id',
                    type: 'int',
                    isNullable: true,
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
                    columnNames: ['recipe_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: RecipesMigration1652967102617.tableName,
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['plan_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: PlansMigration1653679992221.tableName,
                    onDelete: 'CASCADE',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(EventsMigration1660858260323.tableName);
    }

}
