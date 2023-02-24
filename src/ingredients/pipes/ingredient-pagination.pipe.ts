import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { IngredientPaginationOptionsDto } from "../dto/ingredient-pagination-options.dto";

@Injectable()
export class IngredientPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return IngredientPaginationOptionsDto.fromQueryObject(value);
  }
}
