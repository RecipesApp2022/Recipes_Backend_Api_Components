import { Exclude, Expose, Type } from "class-transformer";
import { ReadComboDto } from "src/combos/dto/read-combo.dto";
import { ProductType } from "src/orders/enums/product-type.enum";
import { ReadPlanDto } from "src/plans/dto/read-plan.dto";
import { ReadRecipeDto } from "src/recipes/dto/read-recipe.dto";

@Exclude()
export class ReadPurchasedProductDto {
    @Expose()
    public readonly id: number;

    @Expose()
    public readonly type: ProductType;

    @Expose()
    public readonly productName: string;

    @Expose()
    @Type(() => ReadRecipeDto)
    public readonly recipe: ReadRecipeDto;

    @Expose()
    @Type(() => ReadPlanDto)
    public readonly plan: ReadPlanDto;

    @Expose()
    @Type(() => ReadComboDto)
    public readonly combo: ReadComboDto;

    @Expose()
    public readonly createdAt: string;
}