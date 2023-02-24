import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { FavoritePaginationOptionsDto } from "../dto/favorite-pagination-options.dto";

@Injectable()
export class FavoritePaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return FavoritePaginationOptionsDto.fromQueryObject(value);
  }
}
