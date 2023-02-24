import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { ReadClientDto } from "src/clients/dto/read-client.dto";
import { User } from "src/users/entities/user.entity";
import { PaymentMethod } from "../entities/payment-method.entity";
import { PaymentMethodCode } from "../enums/payment-method-code.enum";

@Exclude()
export class ReadPaymentDto {
    @Expose()
    public readonly id: number;

    @Expose()
    @Type(() => Number)
    public readonly amount: number;

    @Expose()
    public readonly paymentMethodCode: PaymentMethodCode;

    @Expose()
    public readonly paymentMethod: PaymentMethod;

    @Expose()
    public readonly createdAt: string;

    @Expose()
    @Transform(({obj}) => obj.client ? plainToClass(ReadClientDto, User.create({client: obj.client})) : null)
    public readonly client: ReadClientDto;
}