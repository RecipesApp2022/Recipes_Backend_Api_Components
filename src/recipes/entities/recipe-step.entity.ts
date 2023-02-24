import { RecipeStepsMigration1653320854516 } from "src/database/migrations/1653320854516-RecipeStepsMigration";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipes.entity";

@Entity({ name: RecipeStepsMigration1653320854516.tableName })
export class RecipeStep {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'content' })
    public content: string;

    @Column({ name: 'order' })
    public order: number;

    @Column({ name: 'recipe_id', select: false })
    public recipeId: number;
    
    @ManyToOne(() => Recipe)
    @JoinColumn({ name: 'recipe_id' })
    public recipe: Recipe;

    static create(data: Partial<RecipeStep>): RecipeStep {
        return Object.assign(new RecipeStep(), data);
    }
}