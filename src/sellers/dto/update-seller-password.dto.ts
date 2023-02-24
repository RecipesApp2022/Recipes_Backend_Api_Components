import { PickType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { CreateSellerDto } from "./create-seller.dto";

@Exclude()
export class UpdateSellerPasswordDto extends PickType(CreateSellerDto, ['password'] as const) {
  @Expose()
  readonly id: string;
}
