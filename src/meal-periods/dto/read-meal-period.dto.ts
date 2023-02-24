import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadMealPeriodDto {
    @Expose()
    readonly id: number;

    @Expose()
    readonly name: string;
    
    @Expose()
    readonly icon: string;

    @Expose()
    readonly createdAt: string;
}