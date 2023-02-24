import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { CommentPaginationOptionsDto } from "../dto/comment-pagination-options.dto";

@Injectable()
export class CommentPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return CommentPaginationOptionsDto.fromQueryObject(value);
  }
}
