import { Client } from "src/clients/entities/client.entity";
import { Combo } from "src/combos/entities/combo.entity";
import { SavedMigration1656613066963 } from "src/database/migrations/1656613066963-SavedMigration";
import { Plan } from "src/plans/entities/plan.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ReadSaveableDto } from "../dto/read-saveable.dto";
import { SavedType } from "../enum/saved-type.enum";

@Entity({ name: SavedMigration1656613066963.tableName })
export class Saved {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'type' })
    public type: SavedType;

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
    
    get saveable(): ReadSaveableDto {
        switch (this.type) {
            case SavedType.RECIPE:
                return this.recipe?.toFavoritable();
            case SavedType.PLAN:
                return this.plan?.toFavoritable();
            case SavedType.COMBO:
                return this.combo?.toFavoritable();
            default:
                return null;
        }
    }

    static create(data: Partial<Saved>): Saved {
        return Object.assign(new Saved(), data);
    }
}