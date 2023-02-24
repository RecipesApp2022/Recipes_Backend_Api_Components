import { Exclude, Expose } from "class-transformer";
import { IsIn, IsString, Max, MaxLength, Min, MinLength, ValidateIf } from "class-validator";
import { Combo } from "src/combos/entities/combo.entity";
import { ProductType, ProductTypeValues } from "src/orders/enums/product-type.enum";
import { Plan } from "src/plans/entities/plan.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Exists, ObjectTypeFactory } from "src/validation/exists.constrain";

@Exclude()
export class RateProductDto {
    @Expose()
    public readonly clientId: number;

    @Expose()
    @IsIn(ProductTypeValues)
    public readonly type: ProductType;

    @Expose()
    @Exists(new ObjectTypeFactory((_, obj: RateProductDto) => {
        switch(obj.type) {
            case ProductType.RECIPE:
                return Recipe;
            case ProductType.PLAN:
                return Plan;
            case ProductType.COMBO:
                return Combo;
            default:
                return null;
        }
    }))
    public readonly productId: number;

    @Expose()
    @Min(1)
    @Max(5)
    public readonly value: number;

    @Expose()
    @ValidateIf((obj) => obj.comment || obj.value <= 3)
    @IsString()
    @MinLength(3)
    @MaxLength(512)
    public readonly comment: string;
}