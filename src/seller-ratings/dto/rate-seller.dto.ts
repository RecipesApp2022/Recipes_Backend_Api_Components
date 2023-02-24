import { Exclude, Expose } from "class-transformer";
import { IsString, Max, MaxLength, Min, MinLength, ValidateIf } from "class-validator";
import { Order } from "src/orders/entities/order.entity";
import { OrderStatusCode } from "src/orders/enums/order-status-code.enum";
import { Seller } from "src/sellers/entities/seller.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class RateSellerDto {
    @Expose()
    public readonly clientId: number;

    @Expose()
    @Exists(Order, null, (id, { clientId, sellerId }: RateSellerDto) => ({
        where: {
            id,
            clientId,
            sellerId,
        }
    }))
    public readonly orderId: number;

    @Expose()
    @Exists(Seller)
    public readonly sellerId: number;

    @Expose()
    @Min(1)
    @Max(5)
    public readonly value: number;

    @Expose()
    @ValidateIf((obj) => obj.comment || obj.value <= 3)
    @IsString()
    @MinLength(3)
    @MaxLength(512)
    public readonly comment: string;
}