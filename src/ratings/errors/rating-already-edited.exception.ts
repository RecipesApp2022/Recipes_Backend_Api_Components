import { HttpException, HttpStatus } from "@nestjs/common";

export class RatingAlreadyEditedException extends HttpException {
    constructor() {
        super({
            message: 'The rating has already been edited',
        }, HttpStatus.CONFLICT);
    }
}