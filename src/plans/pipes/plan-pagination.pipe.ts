import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { PlanPaginationOptionsDto } from "../dto/plan-pagination-options.dto";

@Injectable()
export class PlanPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return PlanPaginationOptionsDto.fromQueryObject(value);
  }
}
