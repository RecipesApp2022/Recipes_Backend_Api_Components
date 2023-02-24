import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from 'src/events/events.module';
import { SellerRating } from './entities/seller-rating.entity';
import { SellerRatingsController } from './seller-ratings.controller';
import { SellerRatingsService } from './seller-ratings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SellerRating,      
    ]),
  ],
  controllers: [SellerRatingsController],
  providers: [SellerRatingsService]
})
export class SellerRatingsModule {}
