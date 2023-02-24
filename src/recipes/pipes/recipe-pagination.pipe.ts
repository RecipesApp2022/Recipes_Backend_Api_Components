import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { RecipePaginationOptionsDto } from "../dto/recipe-pagination-options.dto";

@Injectable()
export class RecipePaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return RecipePaginationOptionsDto.fromQueryObject(value);
  }
}
