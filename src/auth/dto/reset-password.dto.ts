import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

@Exclude()
export class ResetPasswordDto {
  @Expose()
  @IsNotEmpty()
  public readonly token: string;

  @Expose()
  @IsString()
  @MinLength(8)
  public readonly password: string;

  @Expose()
  @IsEmail()
  public readonly email: string;
}
