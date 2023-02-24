import { Exclude, Expose } from "class-transformer";
import { ArrayMinSize, IsArray } from "class-validator";
import { Exists } from "src/validation/exists.constrain";
import { Combo } from "../entities/combo.entity";

@Exclude()
export class DeleteMultipleCombosDto {
    @Expose()
    @IsArray()
    @ArrayMinSize(1)
    @Exists(Combo, 'id', null, { each: true })
    readonly ids: number[];
}