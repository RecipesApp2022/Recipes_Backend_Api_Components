import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { RecipesMigration1652967102617 } from "./1652967102617-RecipesMigration";
import { PlansMigration1653679992221 } from "./1653679992221-PlansMigration";
import { CombosMigration1654123467552 } from "./1654123467552-CombosMigration";
import { OrdersMigration1662480829264 } from "./1662480829264-OrdersMigration";

export class OrderItemsMigration1662498656253 implements MigrationInterface {

    public static readonly tableName = 'order_items';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: OrderItemsMigration1662498656253.tableName,
            columns: [
                id,
                {
                    name: 'quantity',
                    type: 'int',
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 12,
                    scale: 2,
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'slug',
                    type: 'varchar',
                },
                {
                    name: 'image',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'type',
                    type: 'varchar',
                },
                {
                    name: 'order_id',
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
                {
                    name: 'combo_id',
                    type: 'int',
                    isNullable: true,
                }
            ],
            foreignKeys: [
                {
                    columnNames: ['order_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: OrdersMigration1662480829264.tableName,
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
                {
                    columnNames: ['combo_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: CombosMigration1654123467552.tableName,
                    onDelete: 'CASCADE',
                },
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(OrderItemsMigration1662498656253.tableName);
    }

}
