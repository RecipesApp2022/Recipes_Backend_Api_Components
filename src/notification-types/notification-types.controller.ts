import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AllowAny } from 'src/support/custom-decorators/allow-any';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { UserRoleToBodyInterceptor } from 'src/support/interceptors/user-role-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { ConfigureNotificationTypesDto } from './dto/configure-notification-types.dto';
import { ReadNotificationTypeDto } from './dto/read-notification-type.dto';
import { NotificationType } from './entities/notification-type.entity';
import { NotificationTypesService } from './notification-types.service';
import { NotificationTypePaginationPipe } from './pipes/notification-type-pagination.pipe';

@Controller('notification-types')
export class NotificationTypesController {
  constructor(
    private readonly notificationTypesService: NotificationTypesService,
  ) {}

  @Get()
  @AllowAny()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async paginate(
    @Query(NotificationTypePaginationPipe) options: any,
    @Body('userId') userId: number,
  ): Promise<PaginationResult<ReadNotificationTypeDto>> {
    return (
      await this.notificationTypesService.paginate(options, userId)
    ).toClass(ReadNotificationTypeDto);
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    new UserRoleToBodyInterceptor(),
    new JwtUserToBodyInterceptor(),
  )
  async sync(
    @Body() configureNotificationTypesDto: ConfigureNotificationTypesDto,
  ): Promise<void> {
    await this.notificationTypesService.sync(configureNotificationTypesDto);
  }
}
