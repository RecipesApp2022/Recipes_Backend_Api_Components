import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { ReadIngredientDto } from "src/ingredients/dto/read-ingredient.dto";
import { ReadMeasurementUnitDto } from "src/measurement-units/dto/read-measurement-unit.dto";

class ReadMeasurementUnitWithQuantityDto extends OmitType(ReadMeasurementUnitDto, [] as const) {
    @Expose()
    public readonly quantity: number;
}

@Exclude()
export class ReadShoppingListItemDto extends OmitType(ReadIngredientDto, [] as const) {
    @Expose()
    @Type(() => ReadMeasurementUnitWithQuantityDto)
    public readonly measurementUnits: ReadMeasurementUnitWithQuantityDto[];
}