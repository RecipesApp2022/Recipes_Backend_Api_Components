import { HttpException, HttpStatus } from "@nestjs/common";

export class PlanImageNotFoundException extends HttpException {
    constructor() {
        super({
            message: 'Plan image not found.',
        }, HttpStatus.NOT_FOUND);
    }
}