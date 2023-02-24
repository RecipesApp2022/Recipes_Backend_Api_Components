import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsIn } from "class-validator";
import { Role } from "src/users/enums/role.enum";

@Exclude()
export class ForgotPasswordDto {
    @Expose()
    @IsIn(Object.values(Role))
    public readonly role: Role;
    
    @Expose()
    @IsEmail()
    public readonly email: string;
}