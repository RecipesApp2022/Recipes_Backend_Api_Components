import { HttpException, HttpStatus } from "@nestjs/common";

export class LogoIsRequiredException extends HttpException {
  constructor() {
        super({
            message: ['logo must be an image'],
            error: 'Bad Request'
        }, HttpStatus.BAD_REQUEST);
  }
}
