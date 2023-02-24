import { HttpException, HttpStatus } from "@nestjs/common";

export class SellerNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Vendedor no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
