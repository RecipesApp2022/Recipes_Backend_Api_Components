import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class UserRoleToBodyInterceptor implements NestInterceptor {
  constructor(private propertyName: string = 'role') {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const {role} = request.user as {role: string};

    request.body[this.propertyName] = role;

    return next.handle();
  }

}
