import { Exclude, Expose, Transform } from 'class-transformer';
import { IsIn, ValidateIf } from 'class-validator';
import { FavoriteType, FavoriteTypeValues } from '../enum/favorite-type.enum';

@Exclude()
export class DeleteFavoriteDto {
  @Expose()
  public readonly clientId: number;

  @Expose()
  @IsIn(FavoriteTypeValues)
  public readonly type: FavoriteType;

  @Expose()
  @Transform(({ obj, value }) =>
    obj.type === FavoriteType.RECIPE ? value : null,
  )
  @ValidateIf((obj) => obj.type === FavoriteType.RECIPE)
  public readonly recipeId: number;

  @Expose()
  @Transform(({ obj, value }) =>
    obj.type === FavoriteType.PLAN ? value : null,
  )
  @ValidateIf((obj) => obj.type === FavoriteType.PLAN)
  public readonly planId: number;

  @Expose()
  @Transform(({ obj, value }) =>
    obj.type === FavoriteType.COMBO ? value : null,
  )
  @ValidateIf((obj) => obj.type === FavoriteType.COMBO)
  public readonly comboId: number;
}
