import { HttpException, HttpStatus } from "@nestjs/common";

export class EventNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Event not found',
    }, HttpStatus.NOT_FOUND);
  }
}
