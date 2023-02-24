import { HttpException, HttpStatus } from "@nestjs/common";

export class NotificationNotFoundException extends HttpException {
    constructor() {
        super({
            message: 'Notification not found',
        }, HttpStatus.NOT_FOUND);
    }
}