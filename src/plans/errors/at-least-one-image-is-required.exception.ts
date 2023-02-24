import { BadRequestException } from "@nestjs/common";

export class AtLeastOneImageIsRequiredException extends BadRequestException {
    constructor() {
        super(['You must provide at least one image']);
    }
}