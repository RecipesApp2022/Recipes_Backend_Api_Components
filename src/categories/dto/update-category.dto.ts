import { Exclude, Expose } from "class-transformer";
import { CreateCategoryDto } from "./create-category.dto";

@Exclude()
export class UpdateCategoryDto extends CreateCategoryDto {
    @Expose()
    readonly id: number;
}