import { HttpException, HttpStatus } from "@nestjs/common";

export class CommentNotFoundException extends HttpException {
    constructor() {
      super({
        message: 'Comment not found',
      }, HttpStatus.NOT_FOUND);
    }
  }
  