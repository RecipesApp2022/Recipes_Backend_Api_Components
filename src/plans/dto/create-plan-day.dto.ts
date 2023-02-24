import { Exclude, Expose, Type } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";
import { MealPeriod } from "src/meal-periods/entities/meal-period.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreatePlanDayDto {
    @Expose()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(14)
    public readonly day: number;

    @Expose()
    @Exists(Recipe)
    public readonly recipeId: number;

    @Expose()
    @Exists(MealPeriod)
    public readonly mealPeriodId: number;
}