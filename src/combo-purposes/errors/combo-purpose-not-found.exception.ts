import { HttpException, HttpStatus } from "@nestjs/common";

export class ComboPurposeNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Purpose not found',
    }, HttpStatus.NOT_FOUND);
  }
}
