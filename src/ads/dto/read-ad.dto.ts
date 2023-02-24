import { Exclude, Expose, plainToClass, Transform } from "class-transformer";
import { AdPosition } from "src/ad-positions/entities/ad-position.entity";
import { ReadSellerDto } from "src/sellers/dto/read-seller.dto";
import { User } from "src/users/entities/user.entity";

@Exclude()
export class ReadAdDto {
    @Expose()
    public readonly id: number;

    @Expose()
    public readonly title: string;

    @Expose()
    public readonly description: string;

    @Expose()
    public readonly url: string;

    @Expose()
    public readonly priority: number;

    @Expose()
    public readonly from: string;

    @Expose()
    public readonly until: string;

    @Expose()
    public readonly price: number;

    @Expose()
    public readonly createdAt: Date;

    @Expose()
    @Transform(({obj}) => obj.seller ? plainToClass(ReadSellerDto, User.create({seller: obj.seller})) : null)
    public readonly seller: ReadSellerDto;

    @Expose()
    public readonly adPosition: AdPosition;
}