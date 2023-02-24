import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderCreatedEvent } from 'src/orders/dto/order-created.event';
import { OrderEvent } from 'src/orders/enums/order-event.enum';
import { Seller } from 'src/sellers/entities/seller.entity';
import { Role } from 'src/users/enums/role.enum';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationTypeCode } from '../enum/notification-type-code.enum';
import { AdminsNotifier } from '../support/admins-notifier';
import { WebsocketsGateway } from '../websockets.gateway';

@Injectable()
export class OrderCreatedListener {
  constructor(
    @InjectRepository(Seller)
    private readonly sellersRepository: Repository<Seller>,
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly websocketsGateway: WebsocketsGateway,
    private readonly adminsNotifier: AdminsNotifier,
  ) {}

  @OnEvent(OrderEvent.ORDER_CREATED)
  async handleOrderCreatedEvent({
    orderId,
    sellerId,
  }: OrderCreatedEvent): Promise<void> {
    const notificationData = {
      message: 'An order has been placed!',
      type: NotificationTypeCode.ORDER_CREATED,
      additionalData: { orderId },
    };

    await this.adminsNotifier.notify(notificationData);

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
        userId: seller.id,
      }),
    );

    this.websocketsGateway.notifyByUserIds(
      [seller.userId],
      notification.toDto(),
    );
  }
}
