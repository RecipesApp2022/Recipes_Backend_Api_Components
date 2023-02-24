import { HttpException, HttpStatus } from "@nestjs/common";

export class AdminNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Administrador no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}
