import { HttpException, HttpStatus } from "@nestjs/common";

export class ComboImageNotFoundException extends HttpException {
    constructor(){
        super({
            message: 'Combo image not found.',
        }, HttpStatus.NOT_FOUND);
    }
}