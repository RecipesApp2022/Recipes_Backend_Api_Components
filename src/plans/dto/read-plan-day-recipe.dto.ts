import { Exclude, Expose, Type } from "class-transformer";
import { ReadMealPeriodDto } from "src/meal-periods/dto/read-meal-period.dto";
import { ReadRecipeDto } from "src/recipes/dto/read-recipe.dto";

@Exclude()
export class ReadPlanDayRecipeDto {
    @Expose()
    public readonly id: number;

    @Expose()
    @Type(() => ReadMealPeriodDto)
    public readonly mealPeriod: ReadMealPeriodDto;

    @Expose()
    @Type(() => ReadRecipeDto)
    public readonly recipe: ReadRecipeDto;
}