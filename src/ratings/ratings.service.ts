import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { applySort } from 'src/database/utils/sort';
import { ProductType, ProductTypeValues } from 'src/orders/enums/product-type.enum';
import { PurchasedProduct } from 'src/purchased-products/entities/purchased-product.entity';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { ItemRatedEvent } from './dto/item-rated.event';
import { RateProductDto } from './dto/rate-product.dto';
import { RatingPaginationOptionsDto } from './dto/rating-pagination-options.dto';
import { Rating } from './entities/rating.entity';
import { RatingEvent } from './enum/rating-event.enum';
import { RatingAlreadyEditedException } from './errors/rating-already-edited.exception';
import { ProductNotOwnedException } from './errors/product-not-owned.exception';
import { RatingValueMustBeLowerOrEqualToThreeException } from './errors/rating-must-be-lower-or-equal-to-three.exception';

@Injectable()
export class RatingsService {
    constructor(
        @InjectRepository(PurchasedProduct) private readonly purchasedProductsRepository: Repository<PurchasedProduct>,
        @InjectRepository(Rating) private readonly ratingsRepository: Repository<Rating>,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async paginate({ perPage, offset, filters: {
        itemId,
        itemType,
        sellerId,
    }, sort}: RatingPaginationOptionsDto): Promise<PaginationResult<Rating>> {
        const queryBuilder = this.ratingsRepository.createQueryBuilder('rating')
            .leftJoinAndSelect('rating.recipe', 'recipe', 'rating.itemType = :itemTypeRecipe', { itemTypeRecipe: ProductType.RECIPE })
            .leftJoinAndSelect('recipe.recipeImages', 'recipeImage')
            .leftJoinAndSelect('rating.plan', 'plan', 'rating.itemType = :itemTypePlan', { itemTypePlan: ProductType.PLAN })
            .leftJoinAndSelect('plan.planImages', 'planImage')
            .leftJoinAndSelect('rating.combo', 'combo', 'rating.itemType = :itemTypeCombo', { itemTypeCombo: ProductType.COMBO })
            .leftJoinAndSelect('combo.comboImages', 'comboImage')
            .leftJoinAndSelect('rating.client', 'client')
            .take(perPage)
            .skip(offset);

        if (itemId) queryBuilder.andWhere('rating.itemId = :itemId', { itemId });

        if (itemType) queryBuilder.andWhere('rating.itemType = :itemType', { itemType });

        if (sellerId) queryBuilder.andWhere('(recipe.sellerId = :sellerId OR plan.sellerId = :sellerId OR combo.sellerId = :sellerId)', { sellerId });

        applySort({ sort, entityAlias: 'rating', queryBuilder });

        const [ratings, total] = await queryBuilder.getManyAndCount();
        
        return new PaginationResult(ratings, total, perPage);
    }
    
    async rateProduct({ clientId, type, productId, ...rateProductDto }: RateProductDto): Promise<Rating> {
        const purchasedProduct = await this.purchasedProductsRepository.createQueryBuilder('purchasedProduct')
            .where('purchasedProduct.clientId = :clientId', { clientId })
            .andWhere('purchasedProduct.type = :type', { type })
            .andWhere('purchasedProduct.productId = :productId', { productId })
            .getOne();

        if (!purchasedProduct) {
            throw new ProductNotOwnedException();
        }

        const existingRating = await this.ratingsRepository.createQueryBuilder('rating')
            .where('rating.clientId = :clientId', { clientId })
            .andWhere('rating.itemId = :itemId', { itemId: productId })
            .andWhere('rating.itemType = :itemType', { itemType: type })
            .getOne();

        if (existingRating?.isEdited) {
            throw new RatingAlreadyEditedException();
        }

        if (existingRating?.value > 3) {
            throw new RatingValueMustBeLowerOrEqualToThreeException();
        }

        const rating = existingRating
            ? Object.assign<Rating, Partial<Rating>>(existingRating, {
                ...rateProductDto,
                isEdited: true
            })
            : Rating.create({
                ...rateProductDto,
                clientId,
                itemType: type,
                itemId: productId,
            });

        const savedRating = await this.ratingsRepository.save(rating);

        this.eventEmitter.emit(RatingEvent.ITEM_RATED, new ItemRatedEvent(productId, type));

        return savedRating;
    }
}
