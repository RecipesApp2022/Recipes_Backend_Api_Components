import { AdPosition } from "src/ad-positions/entities/ad-position.entity";
import { AdsMigration1655128981877 } from "src/database/migrations/1655128981877-AdsMigration";
import { Seller } from "src/sellers/entities/seller.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: AdsMigration1655128981877.tableName })
export class Ad {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'img_path' })
    public imgPath: string;

    @Column({ name: 'title' })
    public title: string;

    @Column({ name: 'description' })
    public description: string;

    @Column({ name: 'url' })
    public url: string;

    @Column({ name: 'priority' })
    public priority: number;

    @Column({ name: 'from' })
    public from: Date;

    @Column({ name: 'until' })
    public until: Date;

    @Column({ name: 'price' })
    public price: number;

    @Column({ name: 'seller_id', select: false })
    public sellerId: number;

    @ManyToOne(() => Seller)
    @JoinColumn({ name: 'seller_id' })
    public seller: Seller;

    @Column({ name: 'ad_position_id', select: false })
    public adPositionId: number;

    @ManyToOne(() => AdPosition)
    @JoinColumn({ name: 'ad_position_id' })
    public adPosition: AdPosition;
    
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
        select: false
    })
    public deletedAt: Date;

    static create(data: Partial<Ad>): Ad {
        return Object.assign(new Ad(), data);
    }
}