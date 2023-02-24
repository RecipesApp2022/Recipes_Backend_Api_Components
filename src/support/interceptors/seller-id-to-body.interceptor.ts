import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { Observable } from "rxjs";
import { Seller } from "src/sellers/entities/seller.entity";
import { Repository } from "typeorm";

@Injectable()
export class SellerIdToBodyInterceptor implements NestInterceptor {
  constructor(@InjectRepository(Seller) private sellersRepository: Repository<Seller>) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    const { userId } = request.user as {userId: number};

    const seller = await this.sellersRepository.findOne({ user: { id: userId } })

    request.body.sellerId = seller?.id ?? null;

    return next.handle();
  }

}
