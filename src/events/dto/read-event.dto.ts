import { Exclude, Expose, Transform, Type } from "class-transformer";
import { format } from "date-fns";
import { ReadPlanDto } from "src/plans/dto/read-plan.dto";
import { ReadRecipeDto } from "src/recipes/dto/read-recipe.dto";

@Exclude()
export class ReadEventDto {
    @Expose()
    public readonly id: number;

    @Expose()
    @Transform(({value}) => format(new Date(value.valueOf() + value.getTimezoneOffset() * 60 * 1000), 'yyyy-MM-dd'))
    public readonly start: string;

    @Expose()
    @Transform(({value}) => format(new Date(value.valueOf() + value.getTimezoneOffset() * 60 * 1000), 'yyyy-MM-dd'))
    public readonly end: string;

    @Expose()
    public readonly title: string;

    @Expose()
    @Type(() => ReadRecipeDto)
    public readonly recipe: ReadRecipeDto;

    @Expose()
    @Type(() => ReadPlanDto)
    public readonly plan: ReadPlanDto;
    
    @Expose()
    public readonly createdAt: Date;
}