import { MessageAttachmentsMigration1674486453224 } from 'src/database/migrations/1674486453224-MessageAttachmentsMigration';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';

@Entity({ name: MessageAttachmentsMigration1674486453224.tableName })
export class MessageAttachment {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'name' })
  public readonly name: string;

  @Column({ name: 'path' })
  public readonly path: string;

  @ManyToOne(() => Message)
  @JoinColumn({ name: 'message_id' })
  public readonly message: Message;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
  })
  public updatedAt: Date;

  static create(data: Partial<MessageAttachment>): MessageAttachment {
    return Object.assign(new MessageAttachment(), data);
  }
}
