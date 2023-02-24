import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadPlanDayDto {
    @Expose()
    public readonly id: number;

    @Expose()
    public readonly day: number;

    @Expose()
    public readonly mealPeriods: any;
}