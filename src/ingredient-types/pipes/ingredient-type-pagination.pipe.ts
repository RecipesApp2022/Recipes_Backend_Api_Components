import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { IngredientTypePaginationOptionsDto } from "../dto/ingredient-type-pagination-options.dto";

@Injectable()
export class IngredientTypePaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return IngredientTypePaginationOptionsDto.fromQueryObject(value);
  }
}
