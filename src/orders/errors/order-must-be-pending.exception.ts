import { HttpException, HttpStatus } from "@nestjs/common";

export class OrderMustBePendingException extends HttpException {
    constructor(message: string = null) {
        super({
            message: [`Order must be pending.${message ? ` ${message}` : ''}`]
        }, HttpStatus.BAD_REQUEST);
    }
}