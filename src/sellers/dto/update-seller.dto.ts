import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Role } from "src/users/enums/role.enum";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Not } from "typeorm";
import { Seller } from "../entities/seller.entity";
import { CreateSellerDto } from "./create-seller.dto";

@Exclude()
export class UpdateSellerDto extends OmitType(CreateSellerDto, ['email', 'name', 'password', 'slug', 'credential'] as const) {
  @Expose()
  @Type(() => Number)
  readonly id: number;

  @Expose()
  @Type(() => Number)
  readonly userId: number;

  @Expose()
  readonly role: Role;

  @Expose()
  @IsEmail()
  @MaxLength(150)
  @IsUnique(User, (value, dto: UpdateSellerDto) => ({
    join: {
      alias: 'user',
      leftJoin: {
        seller: 'user.seller',
      },
    },
    where: qb => {
      qb.where({ email: value })
        .andWhere('seller.id <> :sellerId', { sellerId: dto.id })
    }
  }))
  readonly email: string;

  @Expose()
  @IsString()
  @MaxLength(250)
  @MinLength(2)
  @IsUnique(Seller, (value, dto: UpdateSellerDto) => ({
    where: {name: value, id: Not(dto.id)},
  }))
  readonly name: string;
}
