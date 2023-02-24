import { NotificationTypeCode } from 'src/notifications/enum/notification-type-code.enum';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/role.enum';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { UsersMigration1651853413104 } from './1651853413104-UsersMigration';

export const TYPE_CODES_BY_ROLE = new Map([
  [Role.CLIENT, [NotificationTypeCode.COMMENT_ANSWERED]],
  [
    Role.SELLER,
    [
      NotificationTypeCode.COMMENT_CREATED,
      NotificationTypeCode.ORDER_CREATED,
      NotificationTypeCode.PRODUCT_RATED,
      NotificationTypeCode.SELLER_RATED,
    ],
  ],
  [
    Role.ADMIN,
    [
      NotificationTypeCode.ORDER_CREATED,
      NotificationTypeCode.PRODUCT_RATED,
      NotificationTypeCode.SELLER_RATED,
      NotificationTypeCode.SELLER_REGISTERED,
    ],
  ],
]);

export class NotificationTypesMigration1665778649340
  implements MigrationInterface
{
  public static readonly tableName = 'notification_types';
  public static readonly typesByRoleTableName = 'notification_types_by_role';
  public static readonly typesByUserTableName = 'notification_types_by_user';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.createNotificationTypesTable(queryRunner);

    await this.createNotificationTypesByRoleTable(queryRunner);

    await this.createNotificationTypesByUserTable(queryRunner);
  }

  protected async createNotificationTypesTable(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: NotificationTypesMigration1665778649340.tableName,
        columns: [
          {
            name: 'code',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
        ],
      }),
    );

    await queryRunner.query(`
      INSERT INTO \`${NotificationTypesMigration1665778649340.tableName}\`
        (\`code\`, \`name\`)
      VALUES
        ('${NotificationTypeCode.COMMENT_ANSWERED}', 'Comment answered'),
        ('${NotificationTypeCode.COMMENT_CREATED}', 'Comment created'),
        ('${NotificationTypeCode.ORDER_CREATED}', 'Order placed'),
        ('${NotificationTypeCode.PRODUCT_RATED}', 'Product rated'),
        ('${NotificationTypeCode.SELLER_RATED}', 'Seller rated'),
        ('${NotificationTypeCode.SELLER_REGISTERED}', 'Seller registered')
    `);
  }

  protected async createNotificationTypesByRoleTable(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: NotificationTypesMigration1665778649340.typesByRoleTableName,
        columns: [
          {
            name: 'notification_type_code',
            type: 'varchar',
          },
          {
            name: 'role',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['notification_type_code'],
            referencedColumnNames: ['code'],
            referencedTableName:
              NotificationTypesMigration1665778649340.tableName,
            onDelete: 'CASCADE',
          },
        ],
        uniques: [
          {
            columnNames: ['notification_type_code', 'role'],
          },
        ],
      }),
    );

    let insertTypesByRoleQuery = ``;

    for (const [role, types] of TYPE_CODES_BY_ROLE) {
      const values = types.map((type) => `('${type}', '${role}')`).join(', ');

      insertTypesByRoleQuery = `${insertTypesByRoleQuery}${values}, `;
    }

    const finalQueryValues = insertTypesByRoleQuery.substring(
      0,
      insertTypesByRoleQuery.length - 2,
    );

    await queryRunner.query(`
      INSERT INTO \`${NotificationTypesMigration1665778649340.typesByRoleTableName}\`
        (\`notification_type_code\`, \`role\`)
      VALUES
        ${finalQueryValues}
    `);
  }

  protected async createNotificationTypesByUserTable(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: NotificationTypesMigration1665778649340.typesByUserTableName,
        columns: [
          {
            name: 'notification_type_code',
            type: 'varchar',
          },
          {
            name: 'user_id',
            type: 'int',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['notification_type_code'],
            referencedColumnNames: ['code'],
            referencedTableName:
              NotificationTypesMigration1665778649340.tableName,
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: UsersMigration1651853413104.tableName,
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    const users = await queryRunner.manager
      .createQueryBuilder(User, 'user')
      .getMany();

    for (const user of users) {
      await this.insertTypesByUser(queryRunner, user);
    }
  }

  protected async insertTypesByUser(
    queryRunner: QueryRunner,
    user: User,
  ): Promise<void> {
    const typeCodesForRole = TYPE_CODES_BY_ROLE.get(user.role);

    for (const typeCode of typeCodesForRole) {
      await queryRunner.query(`
        INSERT INTO \`${NotificationTypesMigration1665778649340.typesByUserTableName}\`
          (\`notification_type_code\`, \`user_id\`)
        VALUES
          ('${typeCode}', ${user.id})
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      NotificationTypesMigration1665778649340.typesByUserTableName,
    );

    await queryRunner.dropTable(
      NotificationTypesMigration1665778649340.typesByRoleTableName,
    );

    await queryRunner.dropTable(
      NotificationTypesMigration1665778649340.tableName,
    );
  }
}
