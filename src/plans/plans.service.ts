import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { AtLeastOneImageIsRequiredException } from 'src/plans/errors/at-least-one-image-is-required.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanPaginationOptionsDto } from './dto/plan-pagination-options.dto';
import { PlanDayRecipe } from './entities/plan-day-recipe.entity';
import { PlanDay } from './entities/plan-day.entity';
import { Plan } from './entities/plan.entity';
import { PlanNotFoundException } from './errors/plan-not-found.exception';
import { PlanImage } from './entities/plan-image.entity';
import { DeletePlanDto } from './dto/delete-plan.dto';
import { groupBy } from 'lodash';
import { CreatePlanDayDto } from './dto/create-plan-day.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreatePlanImageDto } from './dto/create-plan-image-dto';
import { DeletePlanImageDto } from './dto/delete-plan-image.dto';
import { PlanImageNotFoundException } from './errors/plan-image-not-found.exception';
import { SavedType } from 'src/saved/enum/saved-type.enum';
import { Role } from 'src/users/enums/role.enum';
import { FileRenamer } from 'src/support/file-renamer';
import { ProductType } from 'src/orders/enums/product-type.enum';
import { applySort } from 'src/database/utils/sort';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan) private readonly plansRepository: Repository<Plan>,
    @InjectRepository(PlanDay)
    private readonly planDaysRepository: Repository<PlanDay>,
    @InjectRepository(PlanImage)
    private readonly planImagesRepository: Repository<PlanImage>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    private readonly fileRenamer: FileRenamer,
  ) {}

  async paginate(
    {
      perPage,
      offset,
      filters: {
        id,
        sellerId,
        clientId,
        name,
        hideFavoritedForClientId,
        hideClientPlans,
        rating,
        orderByMostPurchased,
      },
      sort,
    }: PlanPaginationOptionsDto,
    loggedInClientId: number,
  ): Promise<PaginationResult<Plan>> {
    const queryBuilder = this.plansRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.categories', 'category')
      .leftJoinAndSelect('plan.planImages', 'planImage')
      .leftJoinAndSelect('plan.planDays', 'planDay')
      .leftJoinAndSelect('planDay.planDayRecipes', 'planDayRecipe')
      .leftJoinAndSelect('planDayRecipe.mealPeriod', 'mealPeriod')
      .leftJoinAndSelect('planDayRecipe.recipe', 'recipe')
      .leftJoinAndSelect('recipe.recipeImages', 'recipeImage')
      .leftJoinAndSelect('recipe.recipeDifficulty', 'recipeDifficulty')
      .leftJoinAndSelect('recipe.recipeIngredients', 'recipeIngredient')
      .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
      .leftJoinAndSelect('plan.seller', 'seller')
      .leftJoinAndMapOne(
        'plan.saved',
        'plan.saveds',
        'savedByUser',
        `savedByUser.clientId = :loggedInClientId AND type = '${SavedType.PLAN}'`,
        { loggedInClientId },
      )
      .leftJoinAndMapOne(
        'plan.clientRating',
        'plan.ratings',
        'clientRating',
        'clientRating.itemType = :itemType AND clientRating.itemId = plan.id AND clientRating.clientId = :clientId',
        { itemType: ProductType.PLAN, clientId: loggedInClientId },
      )
      .leftJoinAndMapOne(
        'plan.purchasedProduct',
        'plan.purchasedProducts',
        'purchasedProduct',
        'purchasedProduct.type = :type AND purchasedProduct.clientId = :clientId',
        { type: ProductType.PLAN, clientId: loggedInClientId },
      )
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('plan.id = :id', { id });

    if (sellerId)
      queryBuilder.andWhere('plan.sellerId = :sellerId', { sellerId });

    if (clientId)
      queryBuilder.andWhere('plan.clientId = :clientId', { clientId });

    if (hideFavoritedForClientId) {
      queryBuilder.andWhere(
        'NOT EXISTS(SELECT 1 FROM favorites WHERE favorites.plan_id = plan.id AND favorites.client_id = :hideFavoritedForClientId)',
        {
          hideFavoritedForClientId,
        },
      );
    }

    if (name)
      queryBuilder.andWhere('plan.name LIKE :name', { name: `%${name}%` });

    if (hideClientPlans) queryBuilder.andWhere('plan.clientId IS NULL');

    if (rating) queryBuilder.where('plan.rating = :rating', { rating });

    if (orderByMostPurchased)
      queryBuilder
        .addSelect(
          `(SELECT
              COUNT(purchased_products.id)
            FROM
              purchased_products
            WHERE
              purchased_products.type = 'plan' AND
              purchased_products.product_id = plan.id)
          `,
          'plan_purchased_times',
        )
        .addOrderBy('plan_purchased_times', 'DESC');

    applySort({ sort, entityAlias: 'plan', queryBuilder });

    const [plans, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(plans, total, perPage);
  }

  async create(
    {
      categoryIds,
      planDays,
      sellerId,
      clientId,
      role,
      ...createPlanDto
    }: CreatePlanDto,
    images: Express.Multer.File[],
  ): Promise<Plan> {
    if (!images || images.length === 0) {
      throw new AtLeastOneImageIsRequiredException();
    }

    const renamedImages = await this.fileRenamer.renameMulterFiles({
      images,
      itemName: createPlanDto.name,
    });

    const planDaysGroupedByDay = groupBy(planDays, 'day');

    const isSeller = role === Role.SELLER;

    const plan = Plan.create({
      ...createPlanDto,
      sellerId: isSeller ? sellerId : null,
      clientId: !isSeller ? clientId : null,
      categories: await this.categoriesRepository.findByIds(categoryIds),
      planDays: Object.keys(planDaysGroupedByDay).map((day) =>
        PlanDay.create({
          day: +day,
          planDayRecipes: planDaysGroupedByDay[day].map(
            ({ recipeId, mealPeriodId }: CreatePlanDayDto) =>
              PlanDayRecipe.create({ recipeId, mealPeriodId }),
          ),
        }),
      ),
      planImages: renamedImages.map((imageFile) =>
        PlanImage.create({ path: imageFile.path }),
      ),
    });

    return await this.plansRepository.save(plan);
  }

  async findOne(
    idOrSlug: number | string,
    bySlug: boolean = false,
    clientId: number = 0,
  ): Promise<Plan> {
    const queryBuilder = this.plansRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.categories', 'category')
      .leftJoinAndSelect('plan.planImages', 'planImage')
      .leftJoinAndSelect('plan.planDays', 'planDay')
      .leftJoinAndSelect('planDay.planDayRecipes', 'planDayRecipe')
      .leftJoinAndSelect('planDayRecipe.mealPeriod', 'mealPeriod')
      .leftJoinAndSelect('planDayRecipe.recipe', 'recipe')
      .leftJoinAndSelect('recipe.recipeImages', 'recipeImage')
      .leftJoinAndSelect('recipe.recipeDifficulty', 'recipeDifficulty')
      .leftJoinAndSelect('recipe.recipeIngredients', 'recipeIngredient')
      .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
      .leftJoinAndSelect('plan.seller', 'seller')
      .leftJoinAndMapOne(
        'plan.saved',
        'plan.saveds',
        'savedByUser',
        `savedByUser.clientId = :clientId AND type = '${SavedType.PLAN}'`,
        { clientId },
      )
      .leftJoinAndMapOne(
        'plan.clientRating',
        'plan.ratings',
        'clientRating',
        'clientRating.itemType = :itemType AND clientRating.itemId = plan.id AND clientRating.clientId = :clientId',
        { itemType: ProductType.PLAN, clientId },
      )
      .leftJoinAndMapOne(
        'plan.purchasedProduct',
        'plan.purchasedProducts',
        'purchasedProduct',
        'purchasedProduct.type = :type AND purchasedProduct.clientId = :clientId',
        { type: ProductType.PLAN, clientId },
      )
      .leftJoinAndSelect('plan.comments', 'comment')
      .leftJoinAndSelect('comment.client', 'client');

    if (bySlug) {
      queryBuilder.where('plan.slug = :slug', { slug: idOrSlug });
    } else {
      queryBuilder.where('plan.id = :id', { id: idOrSlug });
    }

    const plan = await queryBuilder.getOne();

    if (!plan) {
      throw new PlanNotFoundException();
    }

    return plan;
  }

  async update({
    id,
    role,
    clientId,
    sellerId,
    categoryIds,
    planDays,
    ...updatePlanDto
  }: UpdatePlanDto): Promise<Plan> {
    const queryBuilder = this.plansRepository
      .createQueryBuilder('plan')
      .where('plan.id = :id', { id });

    if (role === Role.SELLER) {
      queryBuilder.andWhere('plan.sellerId = :sellerId', { sellerId });
    } else {
      queryBuilder.andWhere('plan.clientId = :clientId', { clientId });
    }

    const plan = await queryBuilder.getOne();

    if (!plan) {
      throw new PlanNotFoundException();
    }

    await this.planDaysRepository
      .createQueryBuilder('plan')
      .delete()
      .from(PlanDay)
      .where('planId = :planId', { planId: id })
      .execute();

    const planDaysGroupedByDay = groupBy(planDays, 'day');

    Object.assign<Plan, Partial<Plan>>(plan, {
      ...updatePlanDto,
      categories: await this.categoriesRepository.findByIds(categoryIds),
      planDays: Object.keys(planDaysGroupedByDay).map((day) =>
        PlanDay.create({
          day: +day,
          planDayRecipes: planDaysGroupedByDay[day].map(
            ({ recipeId, mealPeriodId }: CreatePlanDayDto) =>
              PlanDayRecipe.create({ recipeId, mealPeriodId }),
          ),
        }),
      ),
    });

    return await this.plansRepository.save(plan);
  }

  async delete({ id, role, sellerId, clientId }: DeletePlanDto): Promise<void> {
    const queryBuilder = this.plansRepository
      .createQueryBuilder('plan')
      .where('plan.id = :id', { id });

    if (role === Role.SELLER) {
      queryBuilder.andWhere('plan.sellerId = :sellerId', { sellerId });
    } else {
      queryBuilder.andWhere('plan.clientId = :clientId', { clientId });
    }

    const plan = await queryBuilder.getOne();

    if (!plan) {
      throw new PlanNotFoundException();
    }

    await this.plansRepository.softRemove(plan);
  }

  async createPlanImage({
    id,
    role,
    clientId,
    sellerId,
    image,
  }: CreatePlanImageDto): Promise<PlanImage> {
    const queryBuilder = this.plansRepository
      .createQueryBuilder('plan')
      .where('plan.id = :id', { id });

    if (role === Role.SELLER) {
      queryBuilder.andWhere('plan.sellerId = :sellerId', { sellerId });
    } else {
      queryBuilder.andWhere('plan.clientId = :clientId', { clientId });
    }

    const plan = await queryBuilder.getOne();

    if (!plan) {
      throw new PlanNotFoundException();
    }

    const planImage = PlanImage.create({
      path: await this.fileRenamer.rename({
        filePath: image.path,
        itemName: plan.name,
      }),
      plan,
    });

    return await this.planImagesRepository.save(planImage);
  }

  async deletePlanImage({
    id,
    imageId,
    role,
    clientId,
    sellerId,
  }: DeletePlanImageDto): Promise<void> {
    const queryBuilder = this.planImagesRepository
      .createQueryBuilder('planImage')
      .innerJoin('planImage.plan', 'plan')
      .where('planImage.id = :imageId', { imageId })
      .andWhere('plan.id = :id', { id });

    if (role === Role.SELLER) {
      queryBuilder.andWhere('plan.sellerId = :sellerId', { sellerId });
    } else {
      queryBuilder.andWhere('plan.clientId = :clientId', { clientId });
    }

    const planImage = await queryBuilder.getOne();

    if (!planImage) {
      throw new PlanImageNotFoundException();
    }

    await this.planImagesRepository.remove(planImage);
  }
}
