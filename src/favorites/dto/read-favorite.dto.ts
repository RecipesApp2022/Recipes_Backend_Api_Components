import { Exclude, Expose, Type } from 'class-transformer';
import { ReadComboDto } from 'src/combos/dto/read-combo.dto';
import { ReadPlanDto } from 'src/plans/dto/read-plan.dto';
import { ReadRecipeDto } from 'src/recipes/dto/read-recipe.dto';
import { FavoriteType } from '../enum/favorite-type.enum';
import { ReadFavoritableDto } from './read-favoritable.dto';

@Exclude()
export class ReadFavoriteDto {
  @Expose()
  public readonly id: number;

  @Expose()
  public readonly type: FavoriteType;

  @Expose()
  public readonly favoritable: ReadFavoritableDto;

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
