import { OmitType } from "@nestjs/mapped-types";
import { Expose, Type } from "class-transformer";
import { PaginateChatsDto } from "./paginate-chats.dto";

export class FindOneChatDto extends OmitType(PaginateChatsDto, [] as const) {
    @Expose()
    @Type(() => Number)
    public readonly id: number;
}