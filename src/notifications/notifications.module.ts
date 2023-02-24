import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Combo } from 'src/combos/entities/combo.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Recipe } from 'src/recipes/entities/recipes.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { User } from 'src/users/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { CommentAnsweredListener } from './listeners/comment-answered.listener';
import { CommentCreatedListener } from './listeners/comment-created.listener';
import { ItemRatedListener } from './listeners/item-rated.listener';
import { OrderCreatedListener } from './listeners/order-created.listener';
import { SellerRatedListener } from './listeners/seller-rated.listener';
import { SellerRegisteredListener } from './listeners/seller-registered.listener';
import { AdminsNotifier } from './support/admins-notifier';
import { WebsocketsGateway } from './websockets.gateway';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { UserRegisteredListener } from './listeners/user-registered.listener';
import { MailModule } from 'src/mail/mail.module';
import { EmailContactCreatedListener } from './listeners/email-contact-created.listener';
import { OneSignalModule } from 'onesignal-api-client-nest';
import { ConfigService } from '@nestjs/config';
import { OneSignalService } from './one-signal.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Recipe, Plan, Combo, Seller, User]),
    MailModule,
    OneSignalModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          appId: configService.get('ONESIGNAL_APP_ID'),
          restApiKey: configService.get('ONESIGNAL_REST_API_KEY'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    NotificationsService,
    OneSignalService,
    WebsocketsGateway,
    AdminsNotifier,
    OrderCreatedListener,
    SellerRegisteredListener,
    CommentCreatedListener,
    CommentAnsweredListener,
    ItemRatedListener,
    SellerRatedListener,
    UserRegisteredListener,
    EmailContactCreatedListener,
  ],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
