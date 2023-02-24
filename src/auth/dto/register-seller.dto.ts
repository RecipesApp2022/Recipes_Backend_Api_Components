import { OmitType } from "@nestjs/mapped-types";
import { Exclude } from "class-transformer";
import { CreateSellerDto } from "src/sellers/dto/create-seller.dto";

@Exclude()
export class RegisterSellersDto extends OmitType(CreateSellerDto, ['instagram', 'facebook', 'description', 'shortDescription', 'userStatusCode'] as const) {
}
