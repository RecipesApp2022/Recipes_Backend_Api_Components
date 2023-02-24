import { HttpException, HttpStatus } from "@nestjs/common";

export class PaymentMethodIsRequiredException extends HttpException {
    constructor() {
        super({
            message: ['Payment method is required.']
        }, HttpStatus.BAD_REQUEST);
    }
}