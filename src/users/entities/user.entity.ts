import { Client } from 'src/clients/entities/client.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { UserStatusCode } from '../enums/user-status-code.enum';
import { Admin } from '../../admins/entities/admin.entity';
import { UserStatus } from '../../user-statuses/entities/user-status.entity';
import { NotificationType } from 'src/notification-types/entities/notification-type.entity';
import { NotificationTypesMigration1665778649340 } from 'src/database/migrations/1665778649340-NotificationTypesMigration';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'email' })
  public email: string;

  @Column({ name: 'password' })
  public password: string;

  @Column({ name: 'role' })
  public role: Role;

  @Column({ name: 'user_status_code', select: false })
  userStatusCode: UserStatusCode;

  @ManyToOne(() => UserStatus)
  @JoinColumn({ name: 'user_status_code' })
  public userStatus: UserStatus;

  @OneToOne(() => Client, (client) => client.user, {
    cascade: ['insert', 'update'],
  })
  client: Client;

  @OneToOne(() => Seller, (seller) => seller.user, {
    cascade: ['insert', 'update'],
  })
  seller: Seller;

  @OneToOne(() => Admin, (admin) => admin.user, {
    cascade: ['insert', 'update'],
  })
  admin: Admin;

  @ManyToMany(() => NotificationType)
  @JoinTable({
    name: NotificationTypesMigration1665778649340.typesByUserTableName,
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'notification_type_code' },
  })
  notificationTypes: NotificationType[];

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
  })
  public updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false,
  })
  public deletedAt: Date;

  static create(data: Partial<User>): User {
    return Object.assign(new User(), data);
  }
}
