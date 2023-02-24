import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsDate } from "class-validator";
import { parse } from "date-fns";

@Exclude()
export class FindRecipesForDayDto {
    @Expose()
    public readonly clientId: number;

    @Expose()
    @Transform(({value}) => parse(value, 'yyyy-MM-dd', new Date()))
    @IsDate()
    public readonly date: Date;
}