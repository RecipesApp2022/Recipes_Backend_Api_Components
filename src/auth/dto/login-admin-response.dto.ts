import { Exclude, Expose, Type } from "class-transformer";
import { ReadAdminDto } from "../../admins/dto/read-admin.dto";

@Exclude()
export class LoginAdminResponse {
  @Expose()
  @Type(() => ReadAdminDto)
  user: ReadAdminDto;

  @Expose()
  accessToken: string;
}
