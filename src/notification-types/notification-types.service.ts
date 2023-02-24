import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { TYPE_CODES_BY_ROLE } from 'src/database/migrations/1665778649340-NotificationTypesMigration';
import { applySort } from 'src/database/utils/sort';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Connection, Repository } from 'typeorm';
import { ConfigureNotificationTypesDto } from './dto/configure-notification-types.dto';
import { NotificationTypePaginationOptionsDto } from './dto/notification-type-pagination-options.dto';
import { NotificationType } from './entities/notification-type.entity';
import { NotificationTypeNotAllowedForRoleException } from './errors/notification-type-not-allowed-for-role.exception';

@Injectable()
export class NotificationTypesService {
  constructor(
    @InjectRepository(NotificationType)
    private readonly notificationTypes: Repository<NotificationType>,
    @InjectConnection()
    private readonly typeOrmConnection: Connection,
  ) {}

  async paginate(
    {
      perPage,
      offset,
      filters: { code, name, role },
      sort,
    }: NotificationTypePaginationOptionsDto,
    userId: number,
  ): Promise<PaginationResult<NotificationType>> {
    const queryBuilder = this.notificationTypes
      .createQueryBuilder('notificationType')
      .leftJoinAndMapOne(
        'notificationType.userToType',
        'notificationType.users',
        'userToType',
        'userToType.id = :userId',
        { userId },
      )
      .take(perPage)
      .skip(offset);

    if (code) queryBuilder.andWhere('notificationType = :code', { code });

    if (name)
      queryBuilder.andWhere('notificationType.name LIKE :name', {
        name: `%${name}%`,
      });

    if (role)
      queryBuilder.andWhere(
        `EXISTS(
            SELECT
                1
            FROM
                notification_types_by_role AS ntbr
            WHERE
                ntbr.notification_type_code = notificationType.code AND
                ntbr.role = :role
        )`,
        { role },
      );

    applySort({ entityAlias: 'notificationType', queryBuilder, sort });

    const [notificationTypes, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(notificationTypes, total, perPage);
  }

  async sync({
    role,
    userId,
    notificationTypeCodes,
  }: ConfigureNotificationTypesDto): Promise<void> {
    const typeCodesByRole = TYPE_CODES_BY_ROLE.get(role);

    for (const typeCode of notificationTypeCodes) {
      if (!typeCodesByRole.includes(typeCode)) {
        throw new NotificationTypeNotAllowedForRoleException(typeCode, role);
      }
    }

    await this.typeOrmConnection.query(`
        DELETE
        FROM
            notification_types_by_user
        WHERE
            user_id = ${userId}
    `);

    if (notificationTypeCodes.length === 0) {
      return;
    }

    const insertQueryValues = notificationTypeCodes
      .map((code) => `('${code}', ${userId})`)
      .join(',');

    await this.typeOrmConnection.query(`
        INSERT INTO notification_types_by_user
            (\`notification_type_code\`, \`user_id\`)
        VALUES
            ${insertQueryValues}
    `);
  }
}
