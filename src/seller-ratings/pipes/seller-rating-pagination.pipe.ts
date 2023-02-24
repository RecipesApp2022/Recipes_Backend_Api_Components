import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { SellerRatingPaginationOptionsDto } from "../dto/seller-rating-pagination-options.dto";

@Injectable()
export class SellerRatingPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return SellerRatingPaginationOptionsDto.fromQueryObject(value);
  }
}
