import { Exclude, Expose, Type } from "class-transformer";
import { Role } from "src/users/enums/role.enum";

@Exclude()
export class PaginateChatsDto {
    @Expose()
    public readonly role: Role;

    @Expose()
    @Type(() => Number)
    public readonly clientId: number;

    @Expose()
    @Type(() => Number)
    public readonly sellerId: number;
}