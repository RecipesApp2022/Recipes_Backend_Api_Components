import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/role.enum';
import { Repository } from 'typeorm';
import { NotificationDto } from '../dto/notification-dto';
import { Notification } from '../entities/notification.entity';
import { WebsocketsGateway } from '../websockets.gateway';

export class AdminsNotifier {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly websocketsGateway: WebsocketsGateway,
  ) {}

  async notify(
    notificationDto: Omit<NotificationDto, 'id' | 'createdAt'>,
  ): Promise<void> {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin(
        'user.notificationTypes',
        'notificationType',
        'notificationType.code = :code',
        { code: notificationDto.type },
      )
      .where('user.role = :role', { role: Role.ADMIN })
      .getMany();

    for (const user of users) {
      const userId = user.id;

      const notification = await this.notificationsRepository.save(
        Notification.create({
          ...notificationDto,
          userId,
        }),
      );

      this.websocketsGateway.notifyByUserIds([userId], notification.toDto());
    }
  }
}
