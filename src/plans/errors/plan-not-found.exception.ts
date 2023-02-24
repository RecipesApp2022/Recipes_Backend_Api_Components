import { HttpException, HttpStatus } from "@nestjs/common";

export class PlanNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Plan not found',
    }, HttpStatus.NOT_FOUND);
  }
}
