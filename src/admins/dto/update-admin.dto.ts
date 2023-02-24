import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsPhoneNumber, MaxLength, ValidateIf } from "class-validator";
import { UserStatus } from "src/user-statuses/entities/user-status.entity";
import { User } from "src/users/entities/user.entity";
import { UserStatusCode } from "src/users/enums/user-status-code.enum";
import { Exists } from "src/validation/exists.constrain";
import { IsUnique } from "src/validation/is-unique.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { Not } from "typeorm";
import { CreateAdminDto } from "./create-admin.dto";

@Exclude()
export class UpdateAdminDto extends OmitType(CreateAdminDto, ['email', 'password'] as const) {
  @Expose()
  readonly id: string;

  @Expose()
  @IsEmail()
  @MaxLength(150)
  @IsUnique(User, (value, dto: UpdateAdminDto) => ({
    where: {email: value, id: Not(dto.id)}
  }))
  readonly email: string;

  @Expose()
  @Exists(UserStatus, 'code')
  readonly userStatusCode: UserStatusCode;
}
