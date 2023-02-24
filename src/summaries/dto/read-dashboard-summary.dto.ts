import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadDashBoardSummary {
    @Expose()
    public readonly clientsCount: number;

    @Expose()
    public readonly recipesCount: number;

    @Expose()
    public readonly plansCount: number;

    @Expose()
    public readonly combosCount: number;

    @Expose()
    public readonly reviewsCount: number;
}