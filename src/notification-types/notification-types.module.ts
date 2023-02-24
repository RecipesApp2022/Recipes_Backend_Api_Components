import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationType } from './entities/notification-type.entity';
import { NotificationTypesController } from './notification-types.controller';
import { NotificationTypesService } from './notification-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationType])],
  controllers: [NotificationTypesController],
  providers: [NotificationTypesService],
})
export class NotificationTypesModule {}
