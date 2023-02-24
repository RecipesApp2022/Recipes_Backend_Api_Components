import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsPhoneNumber, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { IsUnique } from "src/validation/is-unique.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class CreateAdminDto {
  @Expose()
  @IsString()
  @MaxLength(250)
  @MinLength(2)
  readonly name: string;

  @Expose()
  @IsEmail()
  @MaxLength(150)
  @IsUnique(User)
  readonly email: string;

  @Expose()
  @IsString()
  @MinLength(8)
  readonly password: string;

  @Expose()
  @ValidateIf((obj) => obj.phoneNumber)
  @MaxLength(255)
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @Expose()
  @ValidateIf((obj) => obj.address)
  @MaxLength(255)
  readonly address: string;

  @Expose()
  @ValidateIf((obj) => obj.image)
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly image: Express.Multer.File;
}
