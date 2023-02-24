import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super({
      message: 'Invalid credentials',
    }, HttpStatus.BAD_REQUEST);
  }
}
