import { Exclude, Expose, Transform } from "class-transformer";
import { IsIn, ValidateIf } from "class-validator";
import { Combo } from "src/combos/entities/combo.entity";
import { Plan } from "src/plans/entities/plan.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Exists } from "src/validation/exists.constrain";
import { SavedType, SavedTypeValues } from "../enum/saved-type.enum";

@Exclude()
export class ToggleSavedDto {
    @Expose()
    public readonly clientId: number;

    @Expose()
    @IsIn(SavedTypeValues)
    public readonly type: SavedType;

    @Expose()
    @Transform(({obj, value}) => obj.type === SavedType.RECIPE ? value : null)
    @ValidateIf((obj) => obj.type === SavedType.RECIPE)
    @Exists(Recipe)
    public readonly recipeId: number;

    @Expose()
    @Transform(({obj, value}) => obj.type === SavedType.PLAN ? value : null)
    @ValidateIf((obj) => obj.type === SavedType.PLAN)
    @Exists(Plan)
    public readonly planId: number;

    @Expose()
    @Transform(({obj, value}) => obj.type === SavedType.COMBO ? value : null)
    @ValidateIf((obj) => obj.type === SavedType.COMBO)
    @Exists(Combo)
    public readonly comboId: number;
}