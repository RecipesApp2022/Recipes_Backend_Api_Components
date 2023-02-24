import { HttpException, HttpStatus } from "@nestjs/common";

export class RatingValueMustBeLowerOrEqualToThreeException extends HttpException {
    constructor() {
        super({
            message: 'The rating must be between 1 and 3 to be editable',
        }, HttpStatus.CONFLICT);
    }
}