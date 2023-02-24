import { Exclude, Expose } from 'class-transformer';
import { NotificationTypeCode } from 'src/notifications/enum/notification-type-code.enum';

@Exclude()
export class ReadNotificationTypeDto {
  @Expose()
  public readonly code: NotificationTypeCode;

  @Expose()
  public readonly name: string;

  @Expose()
  public readonly isActive: boolean;
}
