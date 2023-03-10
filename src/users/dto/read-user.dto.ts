import { Exclude, Expose } from "class-transformer";
import { UserStatus } from "../../user-statuses/entities/user-status.entity";
import { Role } from "../enums/role.enum";

@Exclude()
export class ReadUserDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly email: string;

  @Expose()
  readonly isActive: boolean;

  @Expose()
  readonly role: Role;

  @Expose()
  readonly createdAt: string;

  @Expose()
  readonly userStatus: UserStatus;
}
