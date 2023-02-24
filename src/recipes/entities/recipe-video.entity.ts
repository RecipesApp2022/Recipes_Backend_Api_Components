import { RecipeVideosMigration1652973115070 } from "src/database/migrations/1652973115070-RecipeVideosMigration";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipes.entity";

@Entity({ name: RecipeVideosMigration1652973115070.tableName })
export class RecipeVideo {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'name' })
    public name: string;
    
    @Column({ name: 'url' })
    public url: string;

    @Column({ name: 'is_recipe_cover' })
    public isRecipeCover: boolean;

    @Column({ name: 'recipe_id', select: false })
    public recipeId: number;

    @ManyToOne(() => Recipe, recipe => recipe.recipeVideos)
    @JoinColumn({ name: 'recipe_id' })
    public recipe: Recipe;

    static create(data: Partial<RecipeVideo>): RecipeVideo {
        return Object.assign(new RecipeVideo(), data);
    }
}