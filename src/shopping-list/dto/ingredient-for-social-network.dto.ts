import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import booleanTransformer from 'src/support/boolean-transformer';

@Exclude()
export class IngredientForSocialNetwork {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @Expose()
  @Transform(booleanTransformer)
  @IsBoolean()
  public readonly checked: boolean;
}
