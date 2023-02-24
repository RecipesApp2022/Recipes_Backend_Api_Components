import { Client } from "src/clients/entities/client.entity";
import { ChatsMigration1660683792492 } from "src/database/migrations/1660683792492-ChatsMigration";
import { Seller } from "src/sellers/entities/seller.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Message } from "./message.entity";

@Entity({ name: ChatsMigration1660683792492.tableName })
export class Chat {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'client_id', select: false })
    public clientId: number;

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
    public client: Client;

    @Column({ name: 'seller_id', select: false })
    public sellerId: number;

    @ManyToOne(() => Seller)
    @JoinColumn({ name: 'seller_id' })
    public seller: Seller;

    @OneToMany(() => Message, message => message.chat, { cascade: ['insert', 'update'] })
    public messages: Message[];

    @CreateDateColumn({
        name: 'created_at',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        select: false,
    })
    public updatedAt: Date;

    static create(data: Partial<Chat>): Chat {
        return Object.assign(new Chat(), data);
    }
}