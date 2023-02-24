import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, ValidateIf } from "class-validator";
import { Combo } from "src/combos/entities/combo.entity";
import { ProductType } from "src/orders/enums/product-type.enum";
import { Plan } from "src/plans/entities/plan.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreateCommentDto {    
    @Expose()
    public readonly clientId: number;
    
    @Expose()
    @IsString()
    @IsNotEmpty()
    @MaxLength(512)
    public readonly comment: string;

    @Expose()
    @ValidateIf(obj => obj.recipeId)
    @Exists(Recipe)
    public readonly recipeId: number;

    @Expose()
    @ValidateIf(obj => obj.planId)
    @Exists(Plan)
    public readonly planId: number;

    @Expose()
    @ValidateIf(obj => obj.comboId)
    @Exists(Combo)
    public readonly comboId: number;

    get type(): ProductType {
        if (this.recipeId) {
            return ProductType.RECIPE;
        }

        if (this.planId) {
            return ProductType.PLAN;
        }

        if (this.comboId) {
            return ProductType.COMBO;
        }

        return null;
    }
}