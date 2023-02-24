import { Exclude, Expose, Type } from "class-transformer";
import { Role } from "src/users/enums/role.enum";

@Exclude()
export class DeletePlanDto {
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