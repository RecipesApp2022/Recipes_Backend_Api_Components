import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { CreateIngredientDto } from "./create-ingredient.dto";

@Exclude()
export class UpdateIngredientDto extends OmitType(CreateIngredientDto, [] as const) {
    @Expose()
    @Type(() => Number)
    readonly id: number;

    @Expose()
    @ValidateIf((obj) => obj.image)
    @IsMimeType(['image/png', 'image/jpeg'])
    readonly icon: Express.Multer.File;
}