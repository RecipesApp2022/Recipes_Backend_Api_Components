import { Exclude, Expose } from "class-transformer";
import { ArrayMinSize, IsArray } from "class-validator";
import { Exists } from "src/validation/exists.constrain";
import { Ingredient } from "../entities/ingredient.entity";

@Exclude()
export class DeleteMultipleIngredientsDto {
    @Expose()
    @IsArray()
    @ArrayMinSize(1)
    @Exists(Ingredient, 'id', null, { each: true })
    readonly ids: number[];
}