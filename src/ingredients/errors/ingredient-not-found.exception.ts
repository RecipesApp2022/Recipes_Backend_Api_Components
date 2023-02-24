import { HttpException, HttpStatus } from "@nestjs/common";

export class IngredientNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Ingrediente no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}
