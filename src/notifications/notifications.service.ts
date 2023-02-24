import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { applySort } from 'src/database/utils/sort';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { NotificationPaginationOptionsDto } from './dto/notification-pagination-options.dto';
import { Notification } from './entities/notification.entity';
import { NotificationNotFoundException } from './errors/notification-not-found.exception';

@Injectable()
export class NotificationsService {
    constructor(@InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>) {}

    async paginate({ perPage, offset, filters: {
        id,
        unreadOnly,
    }, sort}: NotificationPaginationOptionsDto, userId: number): Promise<PaginationResult<Notification>> {
        const queryBuilder = this.notificationsRepository.createQueryBuilder('notification')
            .where('notification.userId = :userId', { userId })
            .take(perPage)
            .skip(offset);

        if (id) queryBuilder.andWhere('notification.id = :id', { id }); 

        if (unreadOnly) queryBuilder.andWhere('notification.readAt IS NULL');

        applySort({ sort, entityAlias: 'notification', queryBuilder });
            
        const [notifications, total] = await queryBuilder.getManyAndCount();

        return new PaginationResult(notifications, total, perPage);
    }

    async markAsRead({ id, userId }): Promise<Notification> {
        const notification = await this.notificationsRepository.createQueryBuilder('notification')
            .where('notification.id = :id', { id })
            .andWhere('notification.userId = :userId', { userId })
            .andWhere('notification.readAt is NULL')
            .getOne();

        if (!notification) {
            throw new NotificationNotFoundException();
        }
            
        notification.markAsRead();

        return this.notificationsRepository.save(notification);
    }

    async markAllAsRead(userId: number): Promise<void> {
        await this.notificationsRepository.createQueryBuilder('notification')
            .update(Notification)
            .set({ readAt: new Date() })
            .where('userId = :userId', { userId })
            .andWhere('readAt IS NULL')
            .execute();
    }

    async notificationsCount(userId: number): Promise<{ total: number; unreadCount: number; readCount: number; }> {
        const total = await this.notificationsRepository.createQueryBuilder('notification')
            .where('notification.userId = :userId', { userId })
            .getCount();

        const unreadCount = await this.notificationsRepository.createQueryBuilder('notification')
            .where('notification.userId = :userId', { userId })
            .andWhere('notification.readAt IS NULL')
            .getCount();

        return {
            total,
            unreadCount,
            readCount: total - unreadCount,
        };
    }
}
