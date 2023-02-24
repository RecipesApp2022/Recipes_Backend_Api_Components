import { Exclude, Expose } from "class-transformer";
import { IsIn, ValidateIf } from "class-validator";
import { Combo } from "src/combos/entities/combo.entity";
import { Plan } from "src/plans/entities/plan.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Exists } from "src/validation/exists.constrain";
import { FavoriteType, FavoriteTypeValues } from "../enum/favorite-type.enum";

@Exclude()
export class ToggleFavoriteDto {
    @Expose()
    public readonly clientId: number;

    @Expose()
    @IsIn(FavoriteTypeValues)
    public readonly type: FavoriteType;

    @Expose()
    @ValidateIf((obj) => obj.type === FavoriteType.RECIPE)
    @Exists(Recipe)
    public readonly recipeId: number;

    @Expose()
    @ValidateIf((obj) => obj.type === FavoriteType.PLAN)
    @Exists(Plan)
    public readonly planId: number;

    @Expose()
    @ValidateIf((obj) => obj.type === FavoriteType.COMBO)
    @Exists(Combo)
    public readonly comboId: number;
}