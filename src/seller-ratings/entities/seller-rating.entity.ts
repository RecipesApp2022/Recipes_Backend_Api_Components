import { Client } from "src/clients/entities/client.entity";
import { SellerRatingsMigration1664304797288 } from "src/database/migrations/1664304797288-SellerRatingsMigration";
import { Order } from "src/orders/entities/order.entity";
import { Seller } from "src/sellers/entities/seller.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: SellerRatingsMigration1664304797288.tableName })
export class SellerRating {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'value' })
    public value: number;

    @Column({ name: 'comment' })
    public comment: string;

    @Column({ name: 'is_edited' })
    public isEdited: boolean;

    @Column({ name: 'seller_id' })
    public sellerId: number;

    @ManyToOne(() => Seller)
    @JoinColumn({ name: 'seller_id' })
    public seller: Seller;
    
    @Column({ name: 'client_id' })
    public clientId: number;

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
    public client: Client;

    @Column({ name: 'order_id' })
    public orderId: number;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    public order: Order;
    
    @CreateDateColumn({
        name: 'created_at',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        select: false,
    })
    public updatedAt: Date;

    static create(data: Partial<SellerRating>): SellerRating {
        return Object.assign(new SellerRating(), data);
    }
}