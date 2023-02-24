import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { CreateRecipeDto } from "./create-recipe.dto";

@Exclude()
export class UpdateRecipeDto extends OmitType(CreateRecipeDto, ['slug', 'sellerId', 'chefId'] as const) {
    @Expose()
    @Type(() => Number)
    public readonly id: number;

    @Expose()
    public readonly sellerId: number;
}