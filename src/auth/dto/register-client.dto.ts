import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { IsUnique } from 'src/validation/is-unique.constrain';

@Exclude()
export class RegisterClientDto {
  @Expose()
  @IsString()
  @MaxLength(250)
  @MinLength(2)
  public readonly name: string;

  @Expose()
  @IsEmail()
  @MaxLength(150)
  @IsUnique(User)
  public readonly email: string;

  @Expose()
  @IsString()
  @MaxLength(50)
  public readonly phoneNumber: string;

  @Expose()
  @IsString()
  @MinLength(8)
  public readonly password: string;

  @Expose()
  @ValidateIf((obj) => obj.instagram)
  @IsString()
  @IsNotEmpty()
  public readonly instagram: string;

  @Expose()
  
  @ValidateIf((obj) => obj.paypal)
  @IsEmail()
  @IsNotEmpty()
  public readonly paypal: string;
}
