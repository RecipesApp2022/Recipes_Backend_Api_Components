import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { RecipeByHierarchyPaginationOptionsDto } from '../dto/recipe-by-hierarchy-pagination-options.dto';

@Injectable()
export class RecipeByHierarchyPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return RecipeByHierarchyPaginationOptionsDto.fromQueryObject(value);
  }
}
