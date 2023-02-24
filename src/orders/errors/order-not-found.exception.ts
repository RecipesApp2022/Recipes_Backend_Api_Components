import { HttpException, HttpStatus } from "@nestjs/common";

export class OrderNotFoundException extends HttpException {
    constructor() {
        super({
            message: 'Order not found exception.'
        }, HttpStatus.NOT_FOUND);
    }
}