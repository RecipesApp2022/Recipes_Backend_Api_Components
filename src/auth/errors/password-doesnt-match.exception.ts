import { HttpException, HttpStatus } from "@nestjs/common";

export class PasswordDoesntMatchException extends HttpException {
    constructor() {
        super({
            message: ['The password doesnt match our records'],
        }, HttpStatus.BAD_REQUEST);
    }
}