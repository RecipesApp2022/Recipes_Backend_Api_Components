import { PlanDayRecipesMigration1654011777584 } from "src/database/migrations/1654011777584-PlanDayRecipesMigration";
import { MealPeriod } from "src/meal-periods/entities/meal-period.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlanDay } from "./plan-day.entity";

@Entity({ name: PlanDayRecipesMigration1654011777584.tableName })
export class PlanDayRecipe {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'plan_day_id', select: false })
    public planDayId: number;
    
    @ManyToOne(() => PlanDay)
    @JoinColumn({ name: 'plan_day_id' })
    public planDay: PlanDay;

    @Column({ name: 'meal_period_id', select: false })
    public mealPeriodId: number;

    @ManyToOne(() => MealPeriod)
    @JoinColumn({ name: 'meal_period_id' })
    public mealPeriod: MealPeriod;

    @Column({ name: 'recipe_id', select: false })
    public recipeId: number;

    @ManyToOne(() => Recipe)
    @JoinColumn({ name: 'recipe_id' })
    public recipe: Recipe;

    static create(data: Partial<PlanDayRecipe>): PlanDayRecipe {
        return Object.assign(new PlanDayRecipe(), data);
    }
}