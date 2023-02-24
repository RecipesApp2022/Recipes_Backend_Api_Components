import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Combo } from 'src/combos/entities/combo.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { ItemRatedEvent } from 'src/ratings/dto/item-rated.event';
import { RatingEvent } from 'src/ratings/enum/rating-event.enum';
import { Recipe } from 'src/recipes/entities/recipes.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/role.enum';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationTypeCode } from '../enum/notification-type-code.enum';
import { AdminsNotifier } from '../support/admins-notifier';
import { WebsocketsGateway } from '../websockets.gateway';

@Injectable()
export class ItemRatedListener {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(Plan) private readonly plansRepository: Repository<Plan>,
    @InjectRepository(Combo)
    private readonly combosRepository: Repository<Combo>,
    private readonly websocketsGateway: WebsocketsGateway,
    private readonly adminsNotifier: AdminsNotifier,
  ) {}

  @OnEvent(RatingEvent.ITEM_RATED)
  async handleItemRatedEvent({
    itemId,
    itemType,
  }: ItemRatedEvent): Promise<void> {
    const notificationData = {
      message: 'A product has been rated.',
      type: NotificationTypeCode.PRODUCT_RATED,
      additionalData: { productId: itemId, type: itemType },
    };

    await this.adminsNotifier.notify(notificationData);

    const repository = this.getRepository(itemType);

    const product = await repository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.seller', 'seller')
      .innerJoinAndSelect('seller.user', 'user')
      .innerJoin(
        'user.notificationTypes',
        'notificationType',
        'notificationType.code = :code',
        { code: NotificationTypeCode.PRODUCT_RATED },
      )
      .where('product.id = :itemId', { itemId })
      .getOne();

    if (!product) {
      return;
    }

    const userId = product.seller.user.id;

    const notification = await this.notificationsRepository.save(
      Notification.create({
        ...notificationData,
        userId,
      }),
    );

    this.websocketsGateway.notifyByUserIds([userId], notification.toDto());
  }

  getRepository(
    type: 'recipe' | 'plan' | 'combo',
  ): Repository<Recipe> | Repository<Plan> | Repository<Combo> {
    switch (type) {
      case 'recipe':
        return this.recipesRepository;
      case 'plan':
        return this.plansRepository;
      case 'combo':
        return this.combosRepository;
      default:
        throw new Error('Invalid type');
    }
  }
}
