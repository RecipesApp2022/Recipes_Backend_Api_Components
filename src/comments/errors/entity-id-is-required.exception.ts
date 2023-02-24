import { HttpException, HttpStatus } from "@nestjs/common";

export class EntityIdIsRequiredException extends HttpException {
    constructor() {
        super({
            message: ['Entity id is required.'],
        }, HttpStatus.BAD_REQUEST);
    }
}