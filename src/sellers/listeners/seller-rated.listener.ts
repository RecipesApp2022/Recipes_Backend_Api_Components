import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerRatedEvent } from 'src/seller-ratings/dto/seller-rated.event';
import { SellerRating } from 'src/seller-ratings/entities/seller-rating.entity';
import { SellerRatingEvent } from 'src/seller-ratings/enum/seller-rating-event.enum';
import { Repository } from 'typeorm';
import { Seller } from '../entities/seller.entity';

export class SellerRatedListener {
  constructor(
    @InjectRepository(SellerRating)
    private readonly sellerRatingsRepository: Repository<SellerRating>,
    @InjectRepository(Seller)
    private readonly sellersRepository: Repository<Seller>,
  ) {}

  @OnEvent(SellerRatingEvent.SELLER_RATED)
  async handleSellerRatedEvent({ sellerId }: SellerRatedEvent): Promise<void> {
    const avgRating = +(
      await this.sellerRatingsRepository
        .createQueryBuilder('rating')
        .select('ROUND(AVG(rating.value), 2)', 'rating')
        .where('rating.sellerId = :sellerId', { sellerId })
        .getRawOne<{ rating: string }>()
    ).rating;

    await this.sellersRepository
      .createQueryBuilder('seller')
      .update(Seller)
      .set({ rating: avgRating })
      .where('id = :sellerId', { sellerId })
      .execute();
  }
}
