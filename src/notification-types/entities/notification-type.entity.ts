import { NotificationTypesMigration1665778649340 } from 'src/database/migrations/1665778649340-NotificationTypesMigration';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { NotificationTypeCode } from '../../notifications/enum/notification-type-code.enum';

@Entity({ name: NotificationTypesMigration1665778649340.tableName })
export class NotificationType {
  @PrimaryColumn({ name: 'code' })
  public readonly code: NotificationTypeCode;

  @Column({ name: 'name' })
  public name: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: NotificationTypesMigration1665778649340.typesByUserTableName,
    joinColumn: { name: 'notification_type_code' },
    inverseJoinColumn: { name: 'user_id' },
  })
  public users: User[];

  public userToType: User;

  public get isActive(): boolean {
    return !!this.userToType;
  }
}
