import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasedProduct } from 'src/purchased-products/entities/purchased-product.entity';
import { Rating } from './entities/rating.entity';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchasedProduct,
      Rating,
    ]),
  ],
  controllers: [RatingsController],
  providers: [RatingsService]
})
export class RatingsModule {}
