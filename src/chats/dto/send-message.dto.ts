import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Role } from 'src/users/enums/role.enum';
import { IsMimeType } from 'src/validation/mime-type.constrain';

@Exclude()
export class SendMessageDto {
  @Expose()
  public readonly role: Role;

  @Expose()
  public readonly userId: number;

  @Expose()
  public readonly sellerId: number;

  @Expose()
  @Type(() => Number)
  public readonly chatId: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public readonly content: string;

  @Expose()
  @IsArray()
  @IsMimeType(['image/png', 'image/jpeg'], {
    each: true,
    message: 'Only images are allowed as attachments.',
  })
  public readonly attachments: Express.Multer.File[];
}
