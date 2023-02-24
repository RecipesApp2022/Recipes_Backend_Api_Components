import { Exclude, Expose } from "class-transformer";
import { Role } from "src/users/enums/role.enum";

@Exclude()
export class PaginateOrdersDto {
    @Expose()
    public readonly role: Role;
    
    @Expose()
    public readonly clientId: number;

    @Expose()
    public readonly sellerId: number;

    get roleIsClient(): boolean {
        return this.role === Role.CLIENT;
    }

    get roleIsSeller(): boolean {
        return this.role === Role.SELLER;
    }
}