import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Client } from 'src/clients/entities/client.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { Exists } from 'src/validation/exists.constrain';
import { IsMimeType } from 'src/validation/mime-type.constrain';

@Exclude()
export class SendMessageToSellerDto {
  @Expose()
  @Type(() => Number)
  @Exists(Client, 'userId')
  public readonly clientId: number;

  @Expose()
  @Type(() => Number)
  @Exists(Seller)
  public readonly sellerId: number;

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
