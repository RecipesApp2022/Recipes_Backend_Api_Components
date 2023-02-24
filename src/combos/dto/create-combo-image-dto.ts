import { Exclude, Expose, Type } from "class-transformer";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class CreateComboImageDto {
    @Expose()
    @Type(() => Number)
    public readonly id: number;

    @Expose()
    public readonly sellerId: number;

    @Expose()
    @IsMimeType(['image/jpeg', 'image/png'])
    public readonly image: Express.Multer.File;
}