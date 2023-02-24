import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { Role } from "src/users/enums/role.enum";
import { CreatePlanDto } from "./create-plan.dto";

@Exclude()
export class UpdatePlanDto extends OmitType(CreatePlanDto, ['slug'] as const) {
    @Expose()
    @Type(() => Number)
    public readonly id: number;

    @Expose()
    public readonly role: Role;

    @Expose()
    public readonly sellerId: number;

    @Expose()
    public readonly clientId: number;
}