import { Exclude, Expose, Type } from "class-transformer";
import { Role } from "src/users/enums/role.enum";

@Exclude()
export class DeleteRecipeImageDto {
    @Expose()
    @Type(() => Number)
    readonly id: number;

    @Expose()
    public readonly role: Role;

    @Expose()
    readonly sellerId: number;

    @Expose()
    @Type(() => Number)
    readonly imageId: number;
}