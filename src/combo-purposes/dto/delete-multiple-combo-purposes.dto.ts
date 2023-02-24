import { Exclude, Expose } from "class-transformer";
import { ArrayMinSize, IsArray } from "class-validator";
import { Exists } from "src/validation/exists.constrain";
import { ComboPurpose } from "../entities/combo-purpose.entity";

@Exclude()
export class DeleteMultipleComboPurposesDto {
    @Expose()
    @IsArray()
    @ArrayMinSize(1)
    @Exists(ComboPurpose, 'id', null, { each: true })
    readonly ids: number[];
}