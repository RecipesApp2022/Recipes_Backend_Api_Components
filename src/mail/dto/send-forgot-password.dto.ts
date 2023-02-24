import { Role } from "src/users/enums/role.enum";

export interface SendForgotPasswordEmailDto {
  email: string;
  token: string;
  role: Role;
}
