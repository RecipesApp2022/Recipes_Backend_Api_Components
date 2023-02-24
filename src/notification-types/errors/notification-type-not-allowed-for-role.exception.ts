import { HttpException, HttpStatus } from '@nestjs/common';
import { NotificationTypeCode } from 'src/notifications/enum/notification-type-code.enum';
import { Role } from 'src/users/enums/role.enum';

export class NotificationTypeNotAllowedForRoleException extends HttpException {
  constructor(type: NotificationTypeCode, role: Role) {
    super(
      {
        message: [`Notification type <${type}> not allowed for role <${role}>`],
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
