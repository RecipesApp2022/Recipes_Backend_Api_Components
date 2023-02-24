import { Exclude, Expose, Type } from "class-transformer";
import { ReadSellerDto } from "src/sellers/dto/read-seller.dto";

@Exclude()
export class LoginSellerResponseDto {
  @Expose()
  @Type(() => ReadSellerDto)
  user: ReadSellerDto;

  @Expose()
  accessToken: string;
}
