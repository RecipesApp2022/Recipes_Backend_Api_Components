import { Exclude, Expose } from "class-transformer";
import { ArrayMinSize, IsArray } from "class-validator";
import { Exists } from "src/validation/exists.constrain";
import { Category } from "../entities/category.entity";

@Exclude()
export class DeleteMultipleCategoriesDto {
    @Expose()
    @IsArray()
    @ArrayMinSize(1)
    @Exists(Category, 'id', null, { each: true })
    readonly ids: number[];
}