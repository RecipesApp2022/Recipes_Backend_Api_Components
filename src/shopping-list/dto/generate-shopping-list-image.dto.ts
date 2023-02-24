import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import booleanTransformer from 'src/support/boolean-transformer';
import { IngredientForSocialNetwork } from './ingredient-for-social-network.dto';

@Exclude()
export class GenerateShoppingListImageDto {
  @Expose()
  @Type(() => IngredientForSocialNetwork)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  public ingredients: IngredientForSocialNetwork[];

  @Expose()
  @Transform(booleanTransformer)
  @IsBoolean()
  public asBase64: boolean;
}
