import { OmitType } from '@nestjs/mapped-types';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import booleanTransformer from 'src/support/boolean-transformer';
import { GenerateShoppingListImageDto } from './generate-shopping-list-image.dto';

@Exclude()
export class StoreShoppingListImage extends OmitType(
  GenerateShoppingListImageDto,
  ['asBase64'] as const,
) {
  @Expose()
  @Type(() => Number)
  public clientId: number;

  @Expose()
  @Transform(booleanTransformer)
  @IsBoolean()
  public storeImage: boolean;
}
