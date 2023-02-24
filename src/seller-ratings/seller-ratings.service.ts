import { ConsoleLogger, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { applySort } from 'src/database/utils/sort';
import { RatingAlreadyEditedException } from 'src/ratings/errors/rating-already-edited.exception';
import { RatingValueMustBeLowerOrEqualToThreeException } from 'src/ratings/errors/rating-must-be-lower-or-equal-to-three.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { RateSellerDto } from './dto/rate-seller.dto';
import { SellerRatedEvent } from './dto/seller-rated.event';
import { SellerRatingPaginationOptionsDto } from './dto/seller-rating-pagination-options.dto';
import { SellerRating } from './entities/seller-rating.entity';
import { SellerRatingEvent } from './enum/seller-rating-event.enum';

@Injectable()
export class SellerRatingsService {
    constructor(
        @InjectRepository(SellerRating) private readonly sellerRatingsRepository: Repository<SellerRating>,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async paginate({ perPage, offset, filters: {
        sellerId,
    }, sort}: SellerRatingPaginationOptionsDto): Promise<PaginationResult<SellerRating>> {
        const queryBuilder = this.sellerRatingsRepository.createQueryBuilder('sellerRating')
            .leftJoinAndSelect('sellerRating.client', 'client')
            .take(perPage)
            .skip(offset);

        if (sellerId) queryBuilder.andWhere('sellerRating.sellerId = :sellerId', { sellerId });

        applySort({ sort, entityAlias: 'sellerRating', queryBuilder });

        const [sellerRatings, total] = await queryBuilder.getManyAndCount();

        return new PaginationResult(sellerRatings, total, perPage);
    }

    async rateSeller({ clientId, orderId, sellerId, ...rateSellerDto }: RateSellerDto): Promise<SellerRating> {
        const existingRating = await this.sellerRatingsRepository.createQueryBuilder('sellerRating')
            .where('sellerRating.clientId = :clientId', { clientId })
            .andWhere('sellerRating.sellerId = :sellerId', { sellerId })
            .andWhere('sellerRating.orderId = :orderId', { orderId })
            .getOne();

        if (existingRating?.isEdited) {
            throw new RatingAlreadyEditedException();
        }
            
        if (existingRating?.value > 3) {
            throw new RatingValueMustBeLowerOrEqualToThreeException();
        }

        const rating = existingRating
            ? Object.assign<SellerRating, Partial<SellerRating>>(existingRating, {
                ...rateSellerDto,
                isEdited: true
            })
            : SellerRating.create({
                ...rateSellerDto,
                clientId,
                sellerId,
                orderId,
            });

        const savedRating = await this.sellerRatingsRepository.save(rating);

        this.eventEmitter.emit(SellerRatingEvent.SELLER_RATED, new SellerRatedEvent(sellerId));
        
        return savedRating;
    }
}
