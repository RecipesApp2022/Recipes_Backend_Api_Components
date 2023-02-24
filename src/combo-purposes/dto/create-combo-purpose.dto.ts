import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class CreateComboPurposeDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    public readonly name: string;
}