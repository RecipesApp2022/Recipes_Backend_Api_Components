import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SellerRegisteredEvent } from 'src/auth/dto/seller-registered.event';
import { AuthEvent } from 'src/auth/enums/auth-event.enum';
import { NotificationTypeCode } from '../enum/notification-type-code.enum';
import { AdminsNotifier } from '../support/admins-notifier';

@Injectable()
export class SellerRegisteredListener {
  constructor(private readonly adminsNotifier: AdminsNotifier) {}

  @OnEvent(AuthEvent.SELLER_REGISTERED)
  handleSellerRegisteredEvent({
    userId,
    sellerId,
    sellerSlug,
  }: SellerRegisteredEvent): void {
    this.adminsNotifier.notify({
      message: 'A new seller has been registered.',
      type: NotificationTypeCode.SELLER_REGISTERED,
      additionalData: { userId, sellerId, sellerSlug },
    });
  }
}
