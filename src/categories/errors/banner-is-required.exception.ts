import { HttpException, HttpStatus } from "@nestjs/common";

export class BannerIsRequiredException extends HttpException {
  constructor() {
        super({
            message: ['banner must be an image'],
            error: 'Bad Request'
        }, HttpStatus.BAD_REQUEST);
  }
}
