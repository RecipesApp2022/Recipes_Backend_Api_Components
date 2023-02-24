import { Exclude, Expose, Transform } from "class-transformer";
import { IsBoolean, IsNumber } from "class-validator";
import { Ingredient } from "src/ingredients/entities/ingredient.entity";
import { MeasurementUnit } from "src/measurement-units/entities/measurement-unit.entity";
import booleanTransformer from "src/support/boolean-transformer";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreateRecipeIngridientDto {
    @Expose()
    @IsNumber()
    public readonly value: number;
    
    @Expose()
    @Exists(Ingredient)
    public readonly ingredientId: number;

    @Expose()
    @Exists(MeasurementUnit)
    public readonly measurementUnitId: number;

    @Expose()
    @Transform(booleanTransformer)
    @IsBoolean()
    public readonly onlyPremium: boolean;
}