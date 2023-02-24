import { HttpException, HttpStatus } from "@nestjs/common";

export class ComboNotFoundException extends HttpException {
    constructor() {
        super({
            message: 'Combo not found.'
        }, HttpStatus.NOT_FOUND);
    }
}