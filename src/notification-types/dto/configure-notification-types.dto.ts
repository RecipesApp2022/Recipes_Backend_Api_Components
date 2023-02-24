import { Exclude, Expose } from 'class-transformer';
import { IsIn, ValidateNested } from 'class-validator';
import { NotificationTypeCode } from 'src/notifications/enum/notification-type-code.enum';
import { Role } from 'src/users/enums/role.enum';

@Exclude()
export class ConfigureNotificationTypesDto {
  @Expose()
  public readonly role: Role;

  @Expose()
  public readonly userId: number;

  @Expose()
  @IsIn(Object.values(NotificationTypeCode), { each: true })
  public readonly notificationTypeCodes: NotificationTypeCode[];
}
