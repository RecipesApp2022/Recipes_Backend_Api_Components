import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ComboPaginationOptionsDto } from "../dto/combo-pagination-options.dto";

@Injectable()
export class ComboPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return ComboPaginationOptionsDto.fromQueryObject(value);
  }
}
