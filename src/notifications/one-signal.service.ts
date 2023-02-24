import { Injectable } from '@nestjs/common';
import { OneSignalService as OneSignalClientService } from 'onesignal-api-client-nest';
import { NotificationByDeviceBuilder } from 'onesignal-api-client-core';
import { ConfigService } from '@nestjs/config';
import { NotificationDto } from './dto/notification-dto';

@Injectable()
export class OneSignalService {
  constructor(
    private readonly oneSignalClientService: OneSignalClientService,
    private readonly configService: ConfigService,
  ) {}

  async notifyUsersById(
    userIds: number[],
    { message, ...notification }: NotificationDto,
  ) {
    const input = new NotificationByDeviceBuilder()
      .setIncludeExternalUserIds(userIds.map((id) => String(id)))
      .notification()
      //   .setHeadings({ en: notification.title })
      .setContents({ en: message })
      .setAttachments({ data: notification })
      .setAppearance({
        large_icon: this.configService.get('ONESIGNAL_LARGE_ICON_URL'),
      })
      .build();

    await this.oneSignalClientService.createNotification(input);
  }
}
