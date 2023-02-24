import { Exclude, Expose, Type } from "class-transformer";
import { Min } from "class-validator";
import { Role } from "src/users/enums/role.enum";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class CreateRecipeImageDto {
    @Expose()
    @Type(() => Number)
    public readonly id: number;

    @Expose()
    public readonly role: Role;

    @Expose()
    public readonly sellerId: number;

    @Expose()
    @IsMimeType(['image/jpeg', 'image/png'])
    public readonly image: Express.Multer.File;
}