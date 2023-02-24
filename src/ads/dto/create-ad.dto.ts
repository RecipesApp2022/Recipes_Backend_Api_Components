import { Exclude, Expose, Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString, IsUrl, MaxLength, Min } from "class-validator";
import { AdPosition } from "src/ad-positions/entities/ad-position.entity";
import { Seller } from "src/sellers/entities/seller.entity";
import { DateAfterField } from "src/validation/date-after-field.constrain";
import { Exists } from "src/validation/exists.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class CreateAdDto {
    @Expose()
    @IsMimeType(['image/jpeg', 'image/png'])
    public readonly image: Express.Multer.File;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    public readonly title: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    public readonly description: string;

    @Expose()
    @IsUrl()
    @IsNotEmpty()
    public readonly url: string;

    @Expose()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    public readonly priority: number;

    @Expose()
    @Type(() => Date)
    @IsDate()
    public readonly from: Date;
  
    @Expose()
    @Type(() => Date)
    @IsDate()
    @DateAfterField('from')
    public readonly until: Date;

    @Expose()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    public readonly price: number;
  
    @Expose()
    @Exists(Seller)
    public readonly sellerId: number;
  
    @Expose()
    @Exists(AdPosition)
    public readonly adPositionId: number;
}