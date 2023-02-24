import { NotificationsMigration1665595867419 } from 'src/database/migrations/1665595867419-NotificationsMigration';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationDto } from '../dto/notification-dto';
import { NotificationTypeCode } from '../enum/notification-type-code.enum';

@Entity({ name: NotificationsMigration1665595867419.tableName })
export class Notification {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'message' })
  public message: string;

  @Column({ name: 'type' })
  public type: NotificationTypeCode;

  @Column({ name: 'additional_data', type: 'json' })
  public additionalData: Object;

  @Column({ name: 'read_at' })
  public readAt: Date;

  @Column({ name: 'user_id' })
  public userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
  })
  public updatedAt: Date;

  public toDto(): NotificationDto {
    return {
      id: this.id,
      message: this.message,
      type: this.type,
      additionalData: this.additionalData,
      createdAt: this.createdAt.toISOString(),
    };
  }

  public markAsRead(): void {
    this.readAt = new Date();
  }

  static create(data: Partial<Notification>): Notification {
    return Object.assign(new Notification(), data);
  }
}
