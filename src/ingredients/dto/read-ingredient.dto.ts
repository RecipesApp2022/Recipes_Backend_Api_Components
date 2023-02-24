import { Exclude, Expose, Type } from "class-transformer";
import { ReadIngredientTypeDto } from "src/ingredient-types/dto/read-ingredient-type.dto";

@Exclude()
export class ReadIngredientDto {
    @Expose()
    readonly id: number;

    @Expose()
    readonly name: string;

    @Expose()
    readonly icon: string;

    @Expose()
    readonly createdAt: string;

    @Expose()
    @Type(() => ReadIngredientTypeDto)
    readonly ingredientType: ReadIngredientTypeDto;
}