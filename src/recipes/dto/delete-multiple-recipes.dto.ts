import { Exclude, Expose, Type } from "class-transformer";
import { ArrayMinSize, IsArray } from "class-validator";
import { Exists } from "src/validation/exists.constrain";
import { Recipe } from "../entities/recipes.entity";

@Exclude()
export class DeleteMultipleRecipesDto {
    @Expose()
    @IsArray()
    @ArrayMinSize(1)
    @Exists(Recipe, 'id', null, { each: true })
    readonly ids: number[];

    @Expose()
    public readonly role: string;

    @Expose()
    @Type(() => Number)
    public readonly sellerId: number;
}