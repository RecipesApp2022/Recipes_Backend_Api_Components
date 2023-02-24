import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { RatingPaginationOptionsDto } from "../dto/rating-pagination-options.dto";

@Injectable()
export class RatingPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return RatingPaginationOptionsDto.fromQueryObject(value);
  }
}
