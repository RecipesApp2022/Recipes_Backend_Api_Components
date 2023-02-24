import { Client } from "src/clients/entities/client.entity";
import { Combo } from "src/combos/entities/combo.entity";
import { FavoritesMigration1655240997961 } from "src/database/migrations/1655240997961-FavoritesMigration";
import { Plan } from "src/plans/entities/plan.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ReadFavoritableDto } from "../dto/read-favoritable.dto";
import { FavoriteReaction } from "../enum/favorite-reaction.enum";
import { FavoriteType } from "../enum/favorite-type.enum";

@Entity({ name: FavoritesMigration1655240997961.tableName })
export class Favorite {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'type' })
    public type: FavoriteType;

    @Column({ name: 'reaction' })
    public reaction: FavoriteReaction;

    @Column({ name: 'client_id', select: false, })
    public clientId: number;

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
    public client: Client;

    @Column({ name: 'recipe_id', select: false })
    public recipeId: number;

    @ManyToOne(() => Recipe)
    @JoinColumn({ name: 'recipe_id' })
    public recipe: Recipe;

    @Column({ name: 'plan_id', select: false })
    public planId: number;

    @ManyToOne(() => Plan)
    @JoinColumn({ name: 'plan_id' })
    public plan: Plan;

    @Column({ name: 'combo_id' })
    public comboId: number;

    @ManyToOne(() => Combo)
    @JoinColumn({ name: 'combo_id' })
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
    
    get favoritable(): ReadFavoritableDto {
        switch (this.type) {
            case FavoriteType.RECIPE:
                return this.recipe?.toFavoritable();
            case FavoriteType.PLAN:
                return this.plan?.toFavoritable();
            case FavoriteType.COMBO:
                return this.combo?.toFavoritable();
            default:
                return null;
        }
    }

    static create(data: Partial<Favorite>): Favorite {
        return Object.assign(new Favorite(), data);
    }
}