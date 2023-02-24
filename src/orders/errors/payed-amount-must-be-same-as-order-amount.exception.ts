import { HttpException, HttpStatus } from "@nestjs/common";

export class PayedAmountMustBeSameAsOrderAmountException extends HttpException {
    constructor() {
        super({
            message: ['Payed amount must be the same as order total'],
        }, HttpStatus.BAD_REQUEST);
    }
}