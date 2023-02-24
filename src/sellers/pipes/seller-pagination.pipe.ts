import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { SellerPaginationOptionsDto } from "../dto/seller-pagination-options.dto";

@Injectable()
export class SellersPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return SellerPaginationOptionsDto.fromQueryObject(value);
  }
}
