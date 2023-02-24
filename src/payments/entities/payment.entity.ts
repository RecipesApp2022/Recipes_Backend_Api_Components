import { Client } from "src/clients/entities/client.entity";
import { PaymentsMigration1663081925449 } from "src/database/migrations/1663081925449-PaymentsMigration";
import { Order } from "src/orders/entities/order.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentMethodCode } from "../enums/payment-method-code.enum";
import { PaymentMethod } from "./payment-method.entity";

@Entity({ name: PaymentsMigration1663081925449.tableName })
export class Payment {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'amount' })
    public amount: number;

    @Column({ name: 'payment_method_code', select: false })
    public paymentMethodCode: PaymentMethodCode;

    @ManyToOne(() => PaymentMethod)
    @JoinColumn({ name: 'payment_method_code' })
    public paymentMethod: PaymentMethod;

    @Column({ name: 'order_id', select: false })
    public orderId: number;

    @OneToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    public order: Order;

    @Column({ name: 'client_id', select: false })
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

    static create(data: Partial<Payment>): Payment {
        return Object.assign(new Payment(), data);
    }
}