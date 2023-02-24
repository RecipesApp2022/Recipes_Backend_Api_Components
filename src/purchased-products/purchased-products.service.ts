import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { applySort } from 'src/database/utils/sort';
import { ProductType } from 'src/orders/enums/product-type.enum';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { PurchasedProductPaginationOptionsDto } from './dto/purchased-product-pagination-options.dto';
import { PurchasedProduct } from './entities/purchased-product.entity';

@Injectable()
export class PurchasedProductsService {
    constructor(@InjectRepository(PurchasedProduct) private readonly purchasedProductsRepository: Repository<PurchasedProduct>) {}

    async paginate({perPage, offset, filters: {
        productId,
        name,
        type,
    }, sort}: PurchasedProductPaginationOptionsDto, clientId: number): Promise<PaginationResult<PurchasedProduct>> {
        const queryBuilder = this.purchasedProductsRepository.createQueryBuilder('purchasedProduct')
            // Recipe
            .leftJoinAndSelect('purchasedProduct.recipe', 'recipe', 'purchasedProduct.type = :recipeType', { recipeType: ProductType.RECIPE })
            .leftJoinAndSelect('recipe.recipeImages', 'recipeImage')
            .leftJoinAndSelect('recipe.mealPeriods', 'mealPeriod')
            .leftJoinAndSelect('recipe.seller', 'recipeSeller')
            .leftJoinAndSelect('recipe.recipeIngredients', 'recipeRecipeIngredient')
            .leftJoinAndMapOne(
                'recipe.clientRating',
                'recipe.ratings',
                'recipeClientRating',
                'recipeClientRating.itemType = :recipeItemType AND recipeClientRating.itemId = recipe.id AND recipeClientRating.clientId = :clientId',
                { recipeItemType: ProductType.RECIPE, clientId },
            )
            // Plan
            .leftJoinAndSelect('purchasedProduct.plan', 'plan', 'purchasedProduct.type = :planType', { planType: ProductType.PLAN })
            .leftJoinAndSelect('plan.planImages', 'planImage')
            .leftJoinAndSelect('plan.seller', 'planSeller')
            .leftJoinAndSelect('plan.planDays', 'planDay')
            .leftJoinAndSelect('planDay.planDayRecipes', 'planDayRecipe')
            .leftJoinAndSelect('planDayRecipe.recipe', 'planDayRecipeRecipe')
            .leftJoinAndSelect('planDayRecipeRecipe.recipeIngredients', 'planDayRecipeRecipeReciprecipeIngredient')
            .leftJoinAndMapOne(
                'plan.clientRating',
                'plan.ratings',
                'planClientRating',
                'planClientRating.itemType = :planItemType AND planClientRating.itemId = plan.id AND planClientRating.clientId = :clientId',
                { planItemType: ProductType.PLAN, clientId },
            )
            // Combo
            .leftJoinAndSelect('purchasedProduct.combo', 'combo', 'purchasedProduct.type = :comboType', { comboType: ProductType.COMBO })
            .leftJoinAndSelect('combo.comboImages', 'comboImage')
            .leftJoinAndSelect('combo.seller', 'comboSeller')
            .leftJoinAndSelect('combo.recipes', 'comboRecipe')
            .leftJoinAndSelect('comboRecipe.recipeIngredients', 'comboRecipeRecipeIngredients')
            .leftJoinAndSelect('combo.plans', 'comboPlan')
            .leftJoinAndSelect('comboPlan.planDays', 'comboPlanPlanDay')
            .leftJoinAndSelect('comboPlanPlanDay.planDayRecipes', 'comboPlanPlanDayPlanDayRecipe')
            .leftJoinAndSelect('comboPlanPlanDayPlanDayRecipe.recipe', 'comboPlanPlanDayPlanDayRecipeRecipe')
            .leftJoinAndSelect('comboPlanPlanDayPlanDayRecipeRecipe.recipeIngredients', 'comboPlanPlanDayPlanDayRecipeRecipeRecipeIngredient')
            .leftJoinAndMapOne(
                'combo.clientRating',
                'combo.ratings',
                'comboClientRating',
                'comboClientRating.itemType = :comboItemType AND comboClientRating.itemId = combo.id AND comboClientRating.clientId = :clientId',
                { comboItemType: ProductType.COMBO, clientId },
            )
            .take(perPage)
            .skip(offset)
            .where('purchasedProduct.clientId = :clientId', { clientId });

        if (productId) queryBuilder.andWhere('purchasedProduct.productId = :productId', { productId });

        if (name) queryBuilder.andWhere('recipe.name LIKE :name OR plan.name LIKE :name OR combo.name = :name', { name: `%${name}%` });

        if (type) queryBuilder.andWhere('purchasedProduct.type = :type', { type });

        applySort({ sort, entityAlias: 'plan', queryBuilder });
        
        const [purchasedProducts, total] = await queryBuilder.getManyAndCount();

        return new PaginationResult(purchasedProducts, total, perPage);
    }
}
