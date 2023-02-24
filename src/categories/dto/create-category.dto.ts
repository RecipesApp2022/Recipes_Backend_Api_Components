import { Exclude, Expose } from "class-transformer";
import { IsString, ValidateIf } from "class-validator";
import { Exists } from "src/validation/exists.constrain";
import { Category } from "../entities/category.entity";

@Exclude()
export class CreateCategoryDto {
    @Expose()
    @IsString()
    public readonly name: string;

    @Expose()
    @ValidateIf((obj) => obj.parentId)
    @Exists(Category)
    public readonly parentId: number;
}