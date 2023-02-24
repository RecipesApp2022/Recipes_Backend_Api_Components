import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { CreateComboDto } from "./create-combo.dto";

@Exclude()
export class UpdateComboDto extends OmitType(CreateComboDto, ['slug'] as const) {
    @Expose()
    @Type(() => Number)
    public readonly id: number;
}