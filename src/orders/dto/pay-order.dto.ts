import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class PayOrderDto {
    @Expose()
    @Type(() => Number)
    public readonly id: number;

    @Expose()
    public readonly clientId: number;
}