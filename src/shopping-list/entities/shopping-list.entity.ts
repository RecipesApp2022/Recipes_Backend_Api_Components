import { Client } from 'src/clients/entities/client.entity';
import { ShoppingListsMigration1675364140645 } from 'src/database/migrations/1675364140645-ShoppingListsMigration';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: ShoppingListsMigration1675364140645.tableName,
})
export class ShoppingList {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'name' })
  public name: string;

  @Column({ name: 'path' })
  public path: string;

  @Column({ name: 'client_id' })
  public clientId: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  public client: Client;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
  })
  public updatedAt: Date;

  static create(data: Partial<ShoppingList>): ShoppingList {
    return Object.assign(new ShoppingList(), data);
  }
}
