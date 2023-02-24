import { RecipeImagesMigration1652970120308 } from "src/database/migrations/1652970120308-RecipeImagesMigration";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipes.entity";

@Entity({ name: RecipeImagesMigration1652970120308.tableName })
export class RecipeImage {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'path' })
    public path: string;

    @Column({ name: 'recipe_id', select: false })
    public recipeId: number;

    @ManyToOne(() => Recipe, recipe => recipe.recipeImages)
    @JoinColumn({ name: 'recipe_id' })
    public recipe: Recipe;

    static create(data: Partial<RecipeImage>): RecipeImage {
        return Object.assign(new RecipeImage(), data);
    }
}