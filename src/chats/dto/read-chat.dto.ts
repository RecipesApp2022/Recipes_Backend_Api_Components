import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { ReadClientDto } from "src/clients/dto/read-client.dto";
import { ReadSellerDto } from "src/sellers/dto/read-seller.dto";
import { User } from "src/users/entities/user.entity";
import { ReadMessageDto } from "./read-message.dto";

@Exclude()
export class ReadChatDto {
    @Expose()
    public readonly id: number;

    @Expose()
    @Type(() => ReadMessageDto)
    public readonly messages: ReadMessageDto[];

    @Expose()
    @Transform(({obj}) => obj.seller ? plainToClass(ReadSellerDto, User.create({seller: obj.seller})) : null)
    public readonly seller: ReadSellerDto;

    @Expose()
    @Transform(({obj}) => obj.client ? plainToClass(ReadClientDto, User.create({client: obj.client})) : null)
    public readonly client: ReadClientDto;

    @Expose()
    public readonly createdAt: string;
}