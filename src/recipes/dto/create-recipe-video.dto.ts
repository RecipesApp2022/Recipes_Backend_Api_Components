import { Exclude, Expose, Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsUrl, MaxLength } from "class-validator";
import booleanTransformer from "src/support/boolean-transformer";

@Exclude()
export class CreateRecipeVideoDto {
    @Expose()
    @IsNotEmpty()
    @MaxLength(255)
    readonly name: string;
  
    @Expose()
    @IsNotEmpty()
    @MaxLength(255)
    @IsUrl()
    readonly url: string;

    @Expose()
    @Transform(booleanTransformer)
    @IsBoolean()
    readonly isRecipeCover: boolean;
}