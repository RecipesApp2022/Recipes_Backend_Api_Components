import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { NotificationTypePaginationOptionsDto } from '../dto/notification-type-pagination-options.dto';

@Injectable()
export class NotificationTypePaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return NotificationTypePaginationOptionsDto.fromQueryObject(value);
  }
}
