import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

@Exclude()
export class UpdatePasswordDto {
    @Expose()
    public readonly userId: string;
    
    @Expose()
    @IsString()
    @MinLength(8)
    public readonly password: string;
    
    @Expose()
    @IsString()
    @IsNotEmpty()
    public readonly currentPassword: string;
}