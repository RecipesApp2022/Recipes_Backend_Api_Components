import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";
import { IngredientType } from "src/ingredient-types/entities/ingredient-type.entity";
import { Exists } from "src/validation/exists.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class CreateIngredientDto {
    @Expose()
    @IsString()
    readonly name: string;

    @Expose()
    @IsMimeType(['image/png', 'image/jpeg'])
    readonly icon: Express.Multer.File;

    @Expose()
    @Exists(IngredientType)
    readonly ingredientTypeId: number;
}