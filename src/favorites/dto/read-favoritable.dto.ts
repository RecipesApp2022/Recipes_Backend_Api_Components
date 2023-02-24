import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class ReadFavoritableDto {
    @Expose()
    public readonly name: string;

    @Expose()
    public readonly slug: string;

    @Expose()
    public readonly imgPath: string;

    @Expose()
    @Type(() => Number)
    public readonly price: number;

    @Expose()
    public readonly sellerName: string;
    
    @Expose()
    public readonly sellerLogo: string;
    
    @Expose()
    public readonly preparationTime: number;
    
    @Expose()
    public readonly numberOfIngredients: number;
    
    @Expose()
    public readonly numberOfItems: number;

    @Expose()
    public readonly mealPeriodName: string;
}