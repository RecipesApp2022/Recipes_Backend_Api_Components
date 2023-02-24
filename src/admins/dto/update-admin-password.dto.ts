import { Exclude, Expose } from "class-transformer";
import { IsString, MinLength } from "class-validator";

@Exclude()
export class UpdateAdminPasswordDto {
  @Expose()
  readonly id: string;

  @Expose()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
