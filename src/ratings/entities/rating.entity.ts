import { Client } from "src/clients/entities/client.entity";
import { Combo } from "src/combos/entities/combo.entity";
import { RatingsMigration1663352824718 } from "src/database/migrations/1663352824718-RatingsMigration";
import { Plan } from "src/plans/entities/plan.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RatingItemType } from "../types/rating-item-type.enum";

@Entity({ name: RatingsMigration1663352824718.tableName })
export class Rating {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'value' })
    public value: number;

    @Column({ name: 'comment' })
    public comment: string;

    @Column({ name: 'is_edited' })
    public isEdited: boolean;

    @Column({ name: 'item_type' })
    public itemType: RatingItemType;

    @Column({ name: 'item_id' })
    public itemId: number;

    @Column({ name: 'client_id' })
    public clientId: number;

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
    public client: Client;

    @ManyToOne(() => Recipe)
    @JoinColumn({ name: 'item_id' })
    public recipe: Recipe;

    @ManyToOne(() => Plan)
    @JoinColumn({ name: 'item_id' })
    public plan: Plan;

    @ManyToOne(() => Combo)
    @JoinColumn({ name: 'item_id' })
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

    static create(data: Partial<Rating>): Rating {
        return Object.assign(new Rating(), data);
    }
}