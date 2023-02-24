import { EmailContactsMigration1669664864066 } from 'src/database/migrations/1669664864066-EmailContactsMigration';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: EmailContactsMigration1669664864066.tableName })
export class EmailContact {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'email' })
  public email: string;

  @Column({ name: 'content' })
  public content: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
  })
  public updatedAt: Date;

  static create(data: Partial<EmailContact>): EmailContact {
    return Object.assign(new EmailContact(), data);
  }
}
