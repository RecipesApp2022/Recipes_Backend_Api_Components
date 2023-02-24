import { Exclude, Expose } from "class-transformer";
import { ArrayMinSize, IsArray } from "class-validator";
import { Exists } from "src/validation/exists.constrain";
import { Ad } from "../entities/ad.entity";

@Exclude()
export class DeleteMultipleAdsDto {
    @Expose()
    @IsArray()
    @ArrayMinSize(1)
    @Exists(Ad, 'id', null, { each: true })
    readonly ids: number[];
}