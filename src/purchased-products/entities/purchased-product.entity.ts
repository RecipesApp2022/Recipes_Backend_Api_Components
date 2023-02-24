import { Client } from "src/clients/entities/client.entity";
import { Combo } from "src/combos/entities/combo.entity";
import { PurchasedProductsMigration1663354371612 } from "src/database/migrations/1663354371612-PurchasedProductsMigration";
import { ProductType } from "src/orders/enums/product-type.enum";
import { Plan } from "src/plans/entities/plan.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PurchasedProductType } from "../types/purchased-product-type";

@Entity({ name: PurchasedProductsMigration1663354371612.tableName })
export class PurchasedProduct {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'client_id', select: false })
    public clientId: number;

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
    public client: Client;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'type' })
    public type: PurchasedProductType;

    @ManyToOne(() => Recipe)
    @JoinColumn({ name: 'product_id' })
    public recipe: Recipe;

    @ManyToOne(() => Plan)
    @JoinColumn({ name: 'product_id' })
    public plan: Plan;

    @ManyToOne(() => Combo)
    @JoinColumn({ name: 'product_id' })
    public combo: Combo;
    
    @CreateDateColumn({
        name: 'created_at',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        select: false,
    })
    public updatedAt: Date;

    get productName(): string {
        return this.recipe?.name || this.plan?.name || this.combo?.name || null;
    }

    static create(data: Partial<PurchasedProduct>): PurchasedProduct {
        return Object.assign(new PurchasedProduct(), data);
    }
}