import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { PurchasedProductPaginationOptionsDto } from "../dto/purchased-product-pagination-options.dto";

@Injectable()
export class PurchasedProductPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return PurchasedProductPaginationOptionsDto.fromQueryObject(value);
  }
}
