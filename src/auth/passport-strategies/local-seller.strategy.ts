import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "src/users/entities/user.entity";
import { Role } from "src/users/enums/role.enum";
import { UserStatusCode } from "src/users/enums/user-status-code.enum";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalSellerStrategy extends PassportStrategy(Strategy, 'local-seller') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Partial<User>> {
    const user = await this.authService.validateUser(email, password, Role.SELLER);

    if (!user) {
      throw new UnauthorizedException('Usuario no existe o esta inactivo');
    }

    if (user.userStatus.code === UserStatusCode.INACTIVE) {
      throw new UnauthorizedException('El usuario está inactivo');
    }

    if (user.userStatus.code === UserStatusCode.BANNED) {
      throw new UnauthorizedException('El usuario está baneado');
    }

    return user;
  }
}
