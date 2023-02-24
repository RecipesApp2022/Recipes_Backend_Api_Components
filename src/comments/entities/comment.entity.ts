import { Client } from "src/clients/entities/client.entity";
import { Combo } from "src/combos/entities/combo.entity";
import { CommentsMigration1659733435894 } from "src/database/migrations/1659733435894-CommentsMigration";
import { ProductType } from "src/orders/enums/product-type.enum";
import { Plan } from "src/plans/entities/plan.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: CommentsMigration1659733435894.tableName })
export class Comment {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'comment' })
    public comment: string;

    @Column({ name: 'answer' })
    public answer: string;

    @Column({ name: 'client_id' })
    public clientId: number;

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
    public client: Client;

    @Column({ name: 'recipe_id' })
    public recipeId: number;

    @ManyToOne(() => Recipe)
    @JoinColumn({ name: 'recipe_id' })
    public recipe: Recipe;

    @Column({ name: 'plan_id' })
    public planId: number;

    @ManyToOne(() => Plan)
    @JoinColumn({ name: 'plan_id' })
    public plan: Plan;

    @Column({ name: 'combo_id' })
    public comboId: number;

    @ManyToOne(() => Combo)
    @JoinColumn({ name: 'combo_id' })
    public combo: Combo;

    @Column({ name: 'answered_at' })
    public answeredAt: Date;

    @CreateDateColumn({
        name: 'created_at',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        select: false,
    })
    public updatedAt: Date;

    public get type(): ProductType {
        if (this.recipeId || this.recipe) {
            return ProductType.RECIPE;
        }

        if (this.planId || this.plan) {
            return ProductType.PLAN;
        }

        if (this.comboId || this.combo) {
            return ProductType.COMBO;
        }

        return null;
    }

    public get productId(): number {
        return this.recipeId || this.planId || this.comboId;
    }

    static create(data: Partial<Comment>): Comment {
        return Object.assign(new Comment(), data);
    }
}