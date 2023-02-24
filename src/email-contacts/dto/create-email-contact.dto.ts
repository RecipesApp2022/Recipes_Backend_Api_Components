import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString, MaxLength } from 'class-validator';

@Exclude()
export class CreateEmailContactDto {
  @Expose()
  @IsEmail()
  public readonly email: string;

  @Expose()
  @IsString()
  @MaxLength(1024)
  public readonly content: string;
}
