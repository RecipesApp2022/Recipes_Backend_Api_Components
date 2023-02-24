import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Transform } from "class-transformer";
import { ReadUserDto } from "src/users/dto/read-user.dto";
import { User } from "src/users/entities/user.entity";

@Exclude()
export class ReadClientDto extends OmitType(ReadUserDto, ['role']) {
  @Expose()
  @Transform(({obj}: {obj: User}) => obj.client.name)
  public readonly name: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.client.phoneNumber)
  public readonly phoneNumber: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.client.instagram)
  public readonly instagram: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.client.paypal)
  public readonly paypal: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.client.imgPath)
  public readonly imgPath: string;
}
