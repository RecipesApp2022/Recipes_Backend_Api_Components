import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class CreateRecipeStepDto {
    @Expose()
    @IsNotEmpty()
    @IsString()
    public readonly content: string;
}