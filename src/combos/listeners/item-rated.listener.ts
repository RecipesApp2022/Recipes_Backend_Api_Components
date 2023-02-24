import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductType } from 'src/orders/enums/product-type.enum';
import { ItemRatedEvent } from 'src/ratings/dto/item-rated.event';
import { Rating } from 'src/ratings/entities/rating.entity';
import { RatingEvent } from 'src/ratings/enum/rating-event.enum';
import { Repository } from 'typeorm';
import { Combo } from '../entities/combo.entity';

@Injectable()
export class ItemRatedListener {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingsRepository: Repository<Rating>,
    @InjectRepository(Combo)
    private readonly combosRepository: Repository<Combo>,
  ) {}

  @OnEvent(RatingEvent.ITEM_RATED)
  async handleItemRatedEvent({
    itemId,
    itemType,
  }: ItemRatedEvent): Promise<void> {
    if (itemType !== ProductType.COMBO) {
      return;
    }

    const avgRating = +(
      await this.ratingsRepository
        .createQueryBuilder('rating')
        .select('ROUND(AVG(rating.value), 2)', 'rating')
        .where('rating.itemId = :itemId', { itemId })
        .where('rating.itemType = :itemType', { itemType })
        .getRawOne<{ rating: string }>()
    ).rating;

    await this.combosRepository
      .createQueryBuilder('combo')
      .update(Combo)
      .set({ rating: avgRating })
      .where('id = :itemId', { itemId })
      .execute();
  }
}
