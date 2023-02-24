import { HttpException, HttpStatus } from "@nestjs/common";

export class OrderAlreadyCapturedException extends HttpException {
    constructor() {
        super({
            message: 'The order has already been captured or the payment service is down',
        }, HttpStatus.BAD_REQUEST);
    }
}