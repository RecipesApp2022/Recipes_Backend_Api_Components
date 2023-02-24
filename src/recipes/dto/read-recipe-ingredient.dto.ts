import { Exclude, Expose, Type } from "class-transformer";
import { ReadIngredientDto } from "src/ingredients/dto/read-ingredient.dto";
import { ReadMeasurementUnitDto } from "src/measurement-units/dto/read-measurement-unit.dto";

@Exclude()
export class ReadRecipeIngredientDto {
    @Expose()
    public readonly id: number;

    @Expose()
    public readonly value: number;

    @Expose()
    public readonly onlyPremium: boolean;

    @Expose()
    @Type(() => ReadIngredientDto)
    public readonly ingredient: ReadIngredientDto;

    @Expose()
    @Type(() => ReadMeasurementUnitDto)
    public readonly measurementUnit: ReadMeasurementUnitDto;
}