import { HttpException, HttpStatus } from "@nestjs/common";

export class FavoriteAlreadyExistsException extends HttpException {
    constructor() {
        super({
            message: ['Favorite already exists for this client'],
        }, HttpStatus.BAD_REQUEST);
    }
}