import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ChatPaginationOptionsDto } from "../dto/chat-pagination-options.dto";

@Injectable()
export class ChatPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return ChatPaginationOptionsDto.fromQueryObject(value);
  }
}
