import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { ReadClientDto } from "src/clients/dto/read-client.dto";
import { ReadPaymentDto } from "src/payments/dto/read-payment.dto";
import { ReadSellerDto } from "src/sellers/dto/read-seller.dto";
import { User } from "src/users/entities/user.entity";
import { OrderStatus } from "../entities/order-status.entity";
import { OrderStatusCode } from "../enums/order-status-code.enum";
import { ReadOrderItemDto } from "./read-order-item.dto";

@Exclude()
export class ReadOrderDto {
    @Expose()
    public readonly id: number;

    @Expose()
    @Type(() => ReadOrderItemDto)
    public readonly orderItems: ReadOrderItemDto[];

    @Expose()
    public readonly orderStatusCode: OrderStatusCode;

    @Expose()
    public readonly orderStatus: OrderStatus;

    @Expose()
    public readonly total: number;

    @Expose()
    public readonly createdAt: string;

    @Expose()
    @Type(() => ReadPaymentDto)
    public readonly payment: ReadPaymentDto;

    @Expose()
    @Transform(({obj}) => obj.seller ? plainToClass(ReadSellerDto, User.create({seller: obj.seller})) : null)
    public readonly seller: ReadSellerDto;

    @Expose()
    @Transform(({obj}) => obj.client ? plainToClass(ReadClientDto, User.create({client: obj.client})) : null)
    public readonly client: ReadClientDto;
}