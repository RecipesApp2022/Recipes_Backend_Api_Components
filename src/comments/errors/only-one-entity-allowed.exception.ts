import { HttpException, HttpStatus } from "@nestjs/common";

export class OnlyOneEntityAllowedException extends HttpException {
    constructor() {
        super({
            message: ['You can only select one entity at a time.'],
        }, HttpStatus.BAD_REQUEST);
    }
}