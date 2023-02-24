import { RecipeIngredientMigration1652986038012 } from "src/database/migrations/1652986038012-RecipeIngredientMigration";
import { Ingredient } from "src/ingredients/entities/ingredient.entity";
import { MeasurementUnit } from "src/measurement-units/entities/measurement-unit.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipes.entity";

@Entity({ name: RecipeIngredientMigration1652986038012.tableName })
export class RecipeIngredient {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'value' })
    public value: number;

    @Column({ name: 'only_premium' })
    public onlyPremium: boolean;

    @Column({ name: 'measurement_unit_id', select: false })
    public measurementUnitId: number;

    @ManyToOne(() => MeasurementUnit)
    @JoinColumn({ name: 'measurement_unit_id' })
    public measurementUnit: MeasurementUnit;

    @Column({ name: 'recipe_id', select: false })
    public recipeId: number;

    @ManyToOne(() => Recipe)
    @JoinColumn({ name: 'recipe_id' })
    public recipe: Recipe;

    @Column({ name: 'ingredient_id', select: false })
    public ingredientId: number;

    @ManyToOne(() => Ingredient)
    @JoinColumn({ name: 'ingredient_id' })
    public ingredient: Ingredient;

    static create(data: Partial<RecipeIngredient>): RecipeIngredient {
        return Object.assign(new RecipeIngredient(), data);
    }
}