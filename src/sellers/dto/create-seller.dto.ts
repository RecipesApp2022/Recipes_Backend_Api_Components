import { Exclude, Expose } from "class-transformer";
import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import { Occupation } from "src/occupations/entities/occupation.entity";
import { UserStatus } from "src/user-statuses/entities/user-status.entity";
import { User } from "src/users/entities/user.entity";
import { UserStatusCode } from "src/users/enums/user-status-code.enum";
import { Exists } from "src/validation/exists.constrain";
import { IsUnique } from "src/validation/is-unique.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { Seller } from "../entities/seller.entity";

@Exclude()
export class CreateSellerDto {
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
  @Exists(UserStatus, 'code')
  readonly userStatusCode: UserStatusCode;

  @Expose()
  @IsString()
  @MaxLength(250)
  @MinLength(2)
  @IsUnique(Seller)
  readonly name: string;

  @Expose()
  @MaxLength(255)
  readonly slug: string;

  @Expose()
  @IsPhoneNumber()
  readonly whatsapp: string;

  @Expose()
  @IsEmail()
  readonly paypal: string;

  @Expose()
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @Expose()
  @ValidateIf((obj) => obj.credentialNumber)
  @IsNotEmpty()
  readonly credentialNumber: string;

  @Expose()
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly credential: Express.Multer.File;

  @Expose()
  @ValidateIf((obj) => obj.instagram)
  @IsString()
  readonly instagram: string;

  @Expose()
  @ValidateIf((obj) => obj.facebook)
  @IsString()
  readonly facebook: string;

  @Expose()
  @ValidateIf((obj) => obj.shortDescription)
  @IsString()
  @MaxLength(255)
  readonly shortDescription: string;

  @Expose()
  @ValidateIf((obj) => obj.description)
  @MaxLength(2500)
  readonly description: string;
  
  @Expose()
  @IsArray()
  @ArrayMinSize(1)
  @Exists(Occupation, 'id', null, { each: true })
  readonly occupationIds: number[];
}
