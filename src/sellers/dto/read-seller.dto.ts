import { OmitType } from '@nestjs/mapped-types';
import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { ReadChatDto } from 'src/chats/dto/read-chat.dto';
import { ReadOccupationDto } from 'src/occupations/dto/read-occupation.dto';
import { ReadSellerRatingDto } from 'src/seller-ratings/dto/read-seller-rating.dto';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { User } from 'src/users/entities/user.entity';

@Exclude()
export class ReadSellerDto extends OmitType(ReadUserDto, ['role']) {
  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.name)
  readonly name: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.slug)
  readonly slug: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.whatsapp)
  readonly whatsapp: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.phoneNumber)
  public phoneNumber: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.paypal)
  readonly paypal: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.id)
  readonly sellerId: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.rating)
  readonly rating: number;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.credential)
  readonly credential: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.credentialNumber)
  readonly credentialNumber: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.instagram)
  readonly instagram: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.facebook)
  readonly facebook: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.shortDescription)
  readonly shortDescription: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.description)
  readonly description: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.banner)
  readonly banner: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.frontImage)
  readonly frontImage: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.logo)
  readonly logo: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.clientRating)
  readonly clientRating: ReadSellerRatingDto;

  @Expose()
  @Transform(
    ({
      obj: {
        seller: { occupations },
      },
    }: {
      obj: User;
    }) => {
      if (!occupations || occupations instanceof ReadOccupationDto) {
        return occupations;
      }

      return plainToInstance(ReadOccupationDto, occupations);
    },
  )
  readonly occupations: ReadOccupationDto;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.seller.chatWithClient)
  readonly chatWithClient: ReadChatDto;
}
