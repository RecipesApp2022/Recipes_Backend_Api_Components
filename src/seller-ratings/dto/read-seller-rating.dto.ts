import { Exclude, Expose, plainToClass, Transform } from "class-transformer";
import { ReadClientDto } from "src/clients/dto/read-client.dto";
import { User } from "src/users/entities/user.entity";

@Exclude()
export class ReadSellerRatingDto {
    @Expose()
    public readonly id: number;

    @Expose()
    public readonly value: number;

    @Expose()
    public readonly comment: string;

    @Expose()
    public readonly isEdited: boolean;

    @Expose()
    public readonly sellerId: number;

    @Expose()
    public readonly createdAt: string;

    @Expose()
    @Transform(({obj}) => obj.client ? plainToClass(ReadClientDto, User.create({client: obj.client})) : null)
    public readonly client: ReadClientDto;
}