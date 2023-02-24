import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ArrayOfFilesToBodyInterceptor implements NestInterceptor {
  constructor(private fieldName: string) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    request.body[this.fieldName] = request.files;

    return next.handle();
  }
}
