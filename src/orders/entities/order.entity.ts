import { format } from 'date-fns';
import { Client } from 'src/clients/entities/client.entity';
import { OrdersMigration1662480829264 } from 'src/database/migrations/1662480829264-OrdersMigration';
import { PaymentMethod } from 'src/payments/entities/payment-method.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { PaymentMethodCode } from 'src/payments/enums/payment-method-code.enum';
import { Seller } from 'src/sellers/entities/seller.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatusCode } from '../enums/order-status-code.enum';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from './order-status.entity';

@Entity({ name: OrdersMigration1662480829264.tableName })
export class Order {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'order_status_code', select: false })
  public orderStatusCode: OrderStatusCode;

  @ManyToOne(() => OrderStatus)
  @JoinColumn({ name: 'order_status_code' })
  public orderStatus: OrderStatus;

  @Column({ name: 'seller_id', select: false })
  public sellerId: number;

  @ManyToOne(() => Seller)
  @JoinColumn({ name: 'seller_id' })
  public seller: Seller;

  @Column({ name: 'client_id', select: false })
  public clientId: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  public client: Client;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: ['insert', 'update'],
  })
  public orderItems: OrderItem[];

  @Column({ name: 'payment_method_code', select: false })
  public paymentMethodCode: PaymentMethodCode;

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({ name: 'payment_method_code' })
  public paymentMethod: PaymentMethod;

  @OneToOne(() => Payment, (payment) => payment.order)
  public payment: Payment;

  @CreateDateColumn({ name: 'created_at' })
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

  get total(): number {
    return (
      this.orderItems?.reduce(
        (total, orderItem) => orderItem.total + total,
        0,
      ) ?? 0
    );
  }

  get isPending(): boolean {
    return this.orderStatus?.code === OrderStatusCode.PENDING;
  }

  get isCompleted(): boolean {
    return (
      this.orderStatusCode === OrderStatusCode.COMPLETED ||
      this.orderStatus?.code === OrderStatusCode.COMPLETED
    );
  }

  get formattedCreatedAt(): string {
    return format(this.createdAt, 'mm/dd/yyyy');
  }

  static create({
    orderStatusCode = OrderStatusCode.PENDING,
    ...data
  }: Partial<Order>): Order {
    return Object.assign(new Order(), { orderStatusCode, ...data });
  }
}
