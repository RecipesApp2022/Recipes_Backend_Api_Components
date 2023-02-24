import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Combo } from 'src/combos/entities/combo.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Recipe } from 'src/recipes/entities/recipes.entity';
import { Repository } from 'typeorm';
import { CommentCreatedEvent } from '../dto/comment-created.event';
import { Notification } from '../entities/notification.entity';
import { NotificationTypeCode } from '../enum/notification-type-code.enum';
import { CommentEvent } from '../events/comment-event.enum';
import { WebsocketsGateway } from '../websockets.gateway';

@Injectable()
export class CommentCreatedListener {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(Plan) private readonly plansRepository: Repository<Plan>,
    @InjectRepository(Combo)
    private readonly combosRepository: Repository<Combo>,
    private readonly websocketsGateway: WebsocketsGateway,
  ) {}

  @OnEvent(CommentEvent.COMMENT_CREATED)
  async handleCommentCreatedEvent({
    type,
    commentId,
    productId,
  }: CommentCreatedEvent): Promise<void> {
    const repository = this.getRepository(type);

    const product = await repository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.seller', 'seller')
      .innerJoinAndSelect('seller.user', 'user')
      .innerJoin(
        'user.notificationTypes',
        'notificationType',
        'notificationType.code = :code',
        { code: NotificationTypeCode.COMMENT_CREATED },
      )
      .where('product.id = :productId', { productId })
      .getOne();

    if (!product) {
      return;
    }

    const userId = product.seller.user.id;

    const notification = await this.notificationsRepository.save(
      Notification.create({
        message: 'A product has been commented',
        type: NotificationTypeCode.COMMENT_CREATED,
        additionalData: { commentId, type, productId },
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
