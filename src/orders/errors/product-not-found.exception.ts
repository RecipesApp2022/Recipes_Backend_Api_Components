import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductNotFoundException extends HttpException {
    constructor() {
        super({
            message: 'Product not found.',
        }, HttpStatus.NOT_FOUND);
    }
}