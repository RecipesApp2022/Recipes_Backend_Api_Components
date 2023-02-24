import { Exclude, Expose, Type } from "class-transformer";
import { IsDate, ValidateIf } from "class-validator";
import { Plan } from "src/plans/entities/plan.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreateEventDto {
    @Expose()
    public readonly clientId: number;
    
    @Expose()
    @ValidateIf((obj) => obj.recipeId)
    @Exists(Recipe)
    public readonly recipeId: number;

    @Expose()
    @ValidateIf((obj) => obj.planId)
    @Exists(Plan)
    public readonly planId: number;

    @Expose()    
    @Type(() => Date)
    @IsDate()
    public readonly start: Date;
}