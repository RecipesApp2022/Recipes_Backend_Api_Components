import { Body, Controller, Get, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { MarkNotificationAsReadDto } from './dto/mark-notification-as-read.dto';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationPaginationPipe } from './pipes/notification-pagination.pipe';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor())
    async paginate(
        @Query(NotificationPaginationPipe) options: any,
        @Body('userId') userId: number
    ): Promise<PaginationResult<Notification>> {
        return await this.notificationsService.paginate(options, userId);
    }

    @Put(':id/mark-as-read')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'id' }))
    async markAsRead(@Body() markNotificationAsReadDto: MarkNotificationAsReadDto): Promise<Notification> {
        return await this.notificationsService.markAsRead(markNotificationAsReadDto);
    }

    @Put('mark-all-as-read')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor())
    async markAllAsRead(@Body('userId') userId: number): Promise<void> {
        await this.notificationsService.markAllAsRead(userId);
    }

    @Get('count')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor())
    async notificationsCount(@Body('userId') userId: number) {
        return await this.notificationsService.notificationsCount(userId);
    }
}
