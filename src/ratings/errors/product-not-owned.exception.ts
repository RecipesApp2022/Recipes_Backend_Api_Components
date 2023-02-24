import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductNotOwnedException extends HttpException {
    constructor() {
        super({
            message: 'Product not owned by client',
        }, HttpStatus.CONFLICT);
    }
}