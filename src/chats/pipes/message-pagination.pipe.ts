import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { MessagePaginationOptionsDto } from "../dto/message-pagination-options.dto";

@Injectable()
export class MessagePaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return MessagePaginationOptionsDto.fromQueryObject(value);
  }
}
