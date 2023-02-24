import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CommentAnsweredEvent } from '../dto/comment-answered.event';
import { Notification } from '../entities/notification.entity';
import { NotificationTypeCode } from '../enum/notification-type-code.enum';
import { CommentEvent } from '../events/comment-event.enum';
import { OneSignalService } from '../one-signal.service';
import { WebsocketsGateway } from '../websockets.gateway';

@Injectable()
export class CommentAnsweredListener {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly websocketsGateway: WebsocketsGateway,
    private readonly oneSignalService: OneSignalService,
  ) {}

  @OnEvent(CommentEvent.COMMENT_ANSWERED)
  async handleCommentAnsweredEvent({
    clientId,
    commentId,
    productId,
    type,
  }: CommentAnsweredEvent): Promise<void> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin(
        'user.notificationTypes',
        'notificationType',
        'notificationType.code = :code',
        { code: NotificationTypeCode.COMMENT_ANSWERED },
      )
      .where('user.id = :userId', { userId: clientId })
      .getOne();

    if (!user) {
      return;
    }

    const notification = await this.notificationsRepository.save(
      Notification.create({
        message: 'Your comment has been answered',
        type: NotificationTypeCode.COMMENT_ANSWERED,
        additionalData: { commentId, productId, type, clientId },
        userId: clientId,
      }),
    );

    this.websocketsGateway.notifyByUserIds([clientId], notification.toDto());

    await this.oneSignalService.notifyUsersById(
      [clientId],
      notification.toDto(),
    );
  }
}
