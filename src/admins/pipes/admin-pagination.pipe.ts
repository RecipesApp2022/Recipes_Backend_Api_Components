import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { AdminPaginationOptionsDto } from "../dto/admin-pagination-options.dto";

@Injectable()
export class AdminPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return AdminPaginationOptionsDto.fromQueryObject(value);
  }
}
