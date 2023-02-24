import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerRatedEvent } from 'src/seller-ratings/dto/seller-rated.event';
import { SellerRatingEvent } from 'src/seller-ratings/enum/seller-rating-event.enum';
import { Seller } from 'src/sellers/entities/seller.entity';
import { Role } from 'src/users/enums/role.enum';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationTypeCode } from '../enum/notification-type-code.enum';
import { AdminsNotifier } from '../support/admins-notifier';
import { WebsocketsGateway } from '../websockets.gateway';

@Injectable()
export class SellerRatedListener {
  constructor(
    @InjectRepository(Seller)
    private readonly sellersRepository: Repository<Seller>,
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly adminsNotifier: AdminsNotifier,
    private readonly websocketsGateway: WebsocketsGateway,
  ) {}

  @OnEvent(SellerRatingEvent.SELLER_RATED)
  async handleSellerRatedEvent({ sellerId }: SellerRatedEvent): Promise<void> {
    const notificationData = {
      type: NotificationTypeCode.SELLER_RATED,
      additionalData: { sellerId },
    };

    await this.adminsNotifier.notify({
      ...notificationData,
      message: 'A seller has been rated',
    });

    const seller = await this.sellersRepository
      .createQueryBuilder('seller')
      .innerJoinAndSelect('seller.user', 'user')
      .innerJoin(
        'user.notificationTypes',
        'notificationType',
        'notificationType.code = :code',
        { code: notificationData.type },
      )
      .where('seller.id = :sellerId', { sellerId })
      .getOne();

    if (!seller) {
      return;
    }

    const notification = await this.notificationsRepository.save(
      Notification.create({
        ...notificationData,
        message: 'You have been rated',
        userId: seller.id,
      }),
    );

    this.websocketsGateway.notifyByUserIds(
      [seller.userId],
      notification.toDto(),
    );
  }
}
