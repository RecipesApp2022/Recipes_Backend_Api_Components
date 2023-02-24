import { Exclude, Expose, Type } from "class-transformer";
import { ReadRatingDto } from "src/ratings/dto/read-rating.dto";
import { ProductType } from "../enums/product-type.enum";

@Exclude()
export class ReadOrderItemDto {
    @Expose()
    public readonly id: number;

    @Expose()
    @Type(() => Number)
    public readonly price: number;

    @Expose()
    public readonly quantity: number;

    @Expose()
    public readonly type: ProductType;

    @Expose()
    public readonly total: number;

    @Expose()
    public readonly productId: number;

    @Expose()
    public readonly name: string;

    @Expose()
    public readonly slug: string;

    @Expose()
    public readonly image: string;
    
    @Expose()
    @Type(() => ReadRatingDto)
    public readonly rating: ReadRatingDto;
}