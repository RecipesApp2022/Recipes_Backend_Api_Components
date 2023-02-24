import { Exclude, Expose } from "class-transformer";
import { ArrayMinSize, IsArray } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Role } from "src/users/enums/role.enum";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class DeleteMultipleSellersDto {
    @Expose()
    @IsArray()
    @ArrayMinSize(1)
    @Exists(User, 'id', (value) => ({
        where: { id: value, role: Role.SELLER }
    }), { each: true })
    readonly ids: number[];
}