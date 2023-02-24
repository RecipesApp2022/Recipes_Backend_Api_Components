import {MigrationInterface, QueryRunner, Table} from "typeorm";
import createdAt from "../columns/created-at";
import deletedAt from "../columns/deleted-at";
import id from "../columns/id";
import updatedAt from "../columns/updated-at";
import { UsersMigration1651853413104 } from "./1651853413104-UsersMigration";

export class SellersMigration1651861624218 implements MigrationInterface {

    public static readonly tableName = 'sellers';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: SellersMigration1651861624218.tableName,
            columns: [
                id,
                {
                    name: 'name',
                    type: 'varchar',
                    length: '150',
                },
                {
                    name: 'slug',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'whatsapp',
                    type: 'varchar',
                    length: '20',
                },
                {
                    name: 'phone_number',
                    type: 'varchar',
                    length: '50',
                },
                {
                    name: 'paypal',
                    type: 'varchar',
                    length: '150',
                },
                {
                    name: 'rating',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'credential',
                    type: 'varchar',
                },
                {
                    name: 'credential_number',
                    type: 'varchar',
                },
                {
                    name: 'facebook',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'instagram',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'short_description',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'description',
                    type: 'text',  
                    isNullable: true,                  
                },
                {
                    name: 'banner',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'front_image',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'logo',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'user_id',
                    type: 'int',
                },
                createdAt,
                updatedAt,
                deletedAt,
            ],
            foreignKeys: [{
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: UsersMigration1651853413104.tableName,
                onDelete: 'CASCADE',
            }]
        }));

        await queryRunner.query(`
            INSERT INTO \`${SellersMigration1651861624218.tableName}\`
                (
                    \`name\`,
                    \`slug\`,
                    \`whatsapp\`,
                    \`phone_number\`,
                    \`paypal\`,
                    \`user_id\`,
                    \`credential\`,
                    \`credential_number\`,
                    \`facebook\`,
                    \`instagram\`,
                    \`short_description\`,
                    \`description\`,
                    \`banner\`,
                    \`front_image\`,
                    \`logo\`
                )
            VALUES
                (
                    'Italians Restaurant',
                    'italian-restaurant',
                    '+584244699385',
                    '+584244699385',
                    'italianrestaurant@gmail.com',
                    3,
                    'uploads/sellers/credencial.jpg',
                    '23165465465',
                    '@italianRestaurant',
                    '@italianRestaurant',
                    'We are a large chain of world-renowned Italian restaurants',
                    'We focus on Italian recipes built with love and affection for all our clients, in our plans you can find recipes for all kinds of diners.',
                    'uploads/sellers/banner.jpg',
                    'uploads/sellers/front-image.jpg',
                    'uploads/sellers/logo.jpg'
                )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(SellersMigration1651861624218.tableName);
    }

}
