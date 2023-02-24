import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { EventPaginationOptionsDto } from "../dto/event-pagination-options.dto";

@Injectable()
export class EventPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return EventPaginationOptionsDto.fromQueryObject(value);
  }
}
