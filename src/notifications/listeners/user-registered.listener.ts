import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { UserRegisteredEvent } from 'src/auth/dto/user-registered.event';
import { AuthEvent } from 'src/auth/enums/auth-event.enum';
import {
  NotificationTypesMigration1665778649340,
  TYPE_CODES_BY_ROLE,
} from 'src/database/migrations/1665778649340-NotificationTypesMigration';
import { User } from 'src/users/entities/user.entity';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class UserRegisteredListener {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @OnEvent(AuthEvent.USER_REGISTERED)
  async handleUserRegisteredEvent({
    userId,
  }: UserRegisteredEvent): Promise<void> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      return;
    }

    const typeCodesForRole = TYPE_CODES_BY_ROLE.get(user.role);

    for (const typeCode of typeCodesForRole) {
      this.connection.query(`
        INSERT INTO \`${NotificationTypesMigration1665778649340.typesByUserTableName}\`
          (\`notification_type_code\`, \`user_id\`)
        VALUES
          ('${typeCode}', ${user.id})
      `);
    }
  }
}
