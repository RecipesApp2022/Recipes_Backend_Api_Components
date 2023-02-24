import { Exclude, Expose, Transform } from "class-transformer";
import { IsIn, ValidateIf } from "class-validator";
import { Combo } from "src/combos/entities/combo.entity";
import { Plan } from "src/plans/entities/plan.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Exists } from "src/validation/exists.constrain";
import { FavoriteReaction, FavoriteReactionValues } from "../enum/favorite-reaction.enum";
import { FavoriteType, FavoriteTypeValues } from "../enum/favorite-type.enum";

@Exclude()
export class CreateFavoriteDto {
    @Expose()
    public readonly clientId: number;

    @Expose()
    @IsIn(FavoriteTypeValues)
    public readonly type: FavoriteType;

    @Expose()
    @IsIn(FavoriteReactionValues)
    public readonly reaction: FavoriteReaction;

    @Expose()
    @Transform(({obj, value}) => obj.type === FavoriteType.RECIPE ? value : null)
    @ValidateIf((obj) => obj.type === FavoriteType.RECIPE)
    @Exists(Recipe)
    public readonly recipeId: number;

    @Expose()
    @Transform(({obj, value}) => obj.type === FavoriteType.PLAN ? value : null)
    @ValidateIf((obj) => obj.type === FavoriteType.PLAN)
    @Exists(Plan)
    public readonly planId: number;

    @Expose()
    @Transform(({obj, value}) => obj.type === FavoriteType.COMBO ? value : null)
    @ValidateIf((obj) => obj.type === FavoriteType.COMBO)
    @Exists(Combo)
    public readonly comboId: number;
}