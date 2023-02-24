import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { CreateComboPurposeDto } from "./create-combo-purpose.dto";

@Exclude()
export class UpdateComboPurpose extends OmitType(CreateComboPurposeDto, [] as const) {
    @Expose()
    @Type(() => Number)
    public readonly id: number;
}