import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { SavedPaginationOptionsDto } from "../dto/saved-pagination-options.dto";

@Injectable()
export class SavedPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return SavedPaginationOptionsDto.fromQueryObject(value);
  }
}
