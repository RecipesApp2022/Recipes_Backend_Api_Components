import { MessagesMigration1660698064395 } from 'src/database/migrations/1660698064395-MessagesMigration';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { MessageAttachment } from './message-attachment.entity';

@Entity({ name: MessagesMigration1660698064395.tableName })
export class Message {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'content' })
  public content: string;

  @Column({ name: 'is_read' })
  public isRead: boolean;

  @Column({ name: 'chat_id', select: false })
  public chatId: number;

  @ManyToOne(() => Chat)
  @JoinColumn({ name: 'chat_id' })
  public chat: Chat;

  @Column({ name: 'user_id' })
  public userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @OneToMany(
    () => MessageAttachment,
    (messageAttachment) => messageAttachment.message,
    { cascade: ['insert', 'update'] },
  )
  public attachments: MessageAttachment[];

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
  })
  public updatedAt: Date;

  static create(data: Partial<Message>): Message {
    return Object.assign(new Message(), data);
  }
}
