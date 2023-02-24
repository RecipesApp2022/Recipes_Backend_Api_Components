import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { CreateAdDto } from "./create-ad.dto";

@Exclude()
export class UpdateAdDto extends OmitType(CreateAdDto, ['image'] as const) {
    @Expose()
    @Type(() => Number)
    public readonly id: number;
    
    @Expose()
    @ValidateIf((obj) => obj.image)
    @IsMimeType(['image/jpeg', 'image/png'])
    public readonly image: Express.Multer.File;
}