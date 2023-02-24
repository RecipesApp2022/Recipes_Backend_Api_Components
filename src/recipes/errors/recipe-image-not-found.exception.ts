import { HttpException, HttpStatus } from "@nestjs/common";

export class RecipeImageNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Recipe image not found',
    }, HttpStatus.NOT_FOUND);
  }
}
