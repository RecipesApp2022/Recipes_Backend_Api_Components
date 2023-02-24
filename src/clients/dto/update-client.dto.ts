import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, MaxLength, ValidateIf } from "class-validator";
import { UserStatus } from "src/user-statuses/entities/user-status.entity";
import { User } from "src/users/entities/user.entity";
import { Role } from "src/users/enums/role.enum";
import { UserStatusCode } from "src/users/enums/user-status-code.enum";
import { Exists } from "src/validation/exists.constrain";
import { IsUnique } from "src/validation/is-unique.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { Not } from "typeorm";
import { CreateClientDto } from "./create-client.dto";

@Exclude()
export class UpdateClientDto extends OmitType(CreateClientDto, ['email', 'image', 'password', 'userStatusCode'] as const) {
  @Expose()
  readonly id: string;

  @Expose()
  readonly role: Role;

  @Expose()
  readonly userId: number;

  @Expose()
  @IsEmail()
  @MaxLength(150)
  @IsUnique(User, (value, dto: UpdateClientDto) => ({
    where: {email: value, id: Not(dto.id)},
  }))
  readonly email: string;

  @Expose()
  @ValidateIf(obj => obj.image)
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly image: Express.Multer.File;

  @Expose()
  @ValidateIf((obj) => obj.role === Role.ADMIN)
  @Exists(UserStatus, 'code')
  readonly userStatusCode: UserStatusCode;
}
