import { HttpException, HttpStatus } from "@nestjs/common";

export class AdNotFoundException extends HttpException {
    constructor() {
        super({
            message: 'Ad not found exception.'
        }, HttpStatus.NOT_FOUND);
    }
}