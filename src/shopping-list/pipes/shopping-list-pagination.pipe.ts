import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ShoppingListPaginationOptionsDto } from '../dto/shopping-list-pagination-options.dto';

@Injectable()
export class ShoppingListPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return ShoppingListPaginationOptionsDto.fromQueryObject(value);
  }
}
