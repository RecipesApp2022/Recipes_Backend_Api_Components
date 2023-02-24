import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { MealPeriod } from 'src/meal-periods/entities/meal-period.entity';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { In, Repository } from 'typeorm';
import { CreateRecipeImageDto } from './dto/create-recipe-image-dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { DeleteMultipleRecipesDto } from './dto/delete-multiple-recipes.dto';
import { DeleteRecipeImageDto } from './dto/delete-recipe-image.dto';
import { DeleteRecipeDto } from './dto/delete-recipe.dto';
import { RecipePaginationOptionsDto } from './dto/recipe-pagination-options.dto';
import { UpdateRecipeDto } from './dto/upate-recipe.dto';
import { RecipeImage } from './entities/recipe-image.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { RecipeStep } from './entities/recipe-step.entity';
import { RecipeVideo } from './entities/recipe-video.entity';
import { Recipe } from './entities/recipes.entity';
import { AtLeastOneImageIsRequiredException } from '../plans/errors/at-least-one-image-is-required.exception';
import { RecipeImageNotFoundException } from './errors/recipe-image-not-found.exception';
import { RecipeNotFoundException } from './errors/recipe-not-found.exception';
import { SavedType } from 'src/saved/enum/saved-type.enum';
import { FileRenamer } from 'src/support/file-renamer';
import { ProductType } from 'src/orders/enums/product-type.enum';
import { applySort } from 'src/database/utils/sort';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { RecipeByHierarchyPaginationOptionsDto } from './dto/recipe-by-hierarchy-pagination-options.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(MealPeriod)
    private readonly mealPeriodsRepository: Repository<MealPeriod>,
    @InjectRepository(RecipeIngredient)
    private readonly recipeIngredientsRepository: Repository<RecipeIngredient>,
    @InjectRepository(RecipeVideo)
    private readonly recipeVideosRepository: Repository<RecipeVideo>,
    @InjectRepository(RecipeStep)
    private readonly recipeStepsRepository: Repository<RecipeStep>,
    @InjectRepository(RecipeImage)
    private readonly recipeImagesRepository: Repository<RecipeImage>,
    private readonly fileRenamer: FileRenamer,
  ) {}

  async paginate(
    {
      perPage,
      offset,
      filters: {
        id,
        name,
        sellerId,
        hideFavoritedForClientId,
        rating,
        orderByMostPurchased,
      },
      sort,
    }: RecipePaginationOptionsDto,
    clientId: number,
  ): Promise<PaginationResult<Recipe>> {
    const queryBuilder = this.recipesRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.recipeDifficulty', 'recipeDifficulty')
      .leftJoinAndSelect('recipe.categories', 'category')
      .leftJoinAndSelect('recipe.mealPeriods', 'mealPeriod')
      .leftJoinAndSelect('recipe.recipeImages', 'recipeImage')
      .leftJoinAndSelect('recipe.recipeVideos', 'recipeVideo')
      .leftJoinAndSelect('recipe.recipeSteps', 'recipeStep')
      .leftJoinAndSelect('recipe.recipeIngredients', 'recipeIngredient')
      .leftJoinAndSelect('recipeIngredient.measurementUnit', 'measurementUnit')
      .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
      .leftJoinAndSelect('recipe.seller', 'seller')
      .leftJoinAndMapOne(
        'recipe.saved',
        'recipe.saveds',
        'savedByUser',
        `savedByUser.clientId = :clientId AND type = '${SavedType.RECIPE}'`,
        { clientId },
      )
      .leftJoinAndMapOne(
        'recipe.clientRating',
        'recipe.ratings',
        'clientRating',
        'clientRating.itemType = :itemType AND clientRating.itemId = recipe.id AND clientRating.clientId = :clientId',
        { itemType: ProductType.RECIPE, clientId },
      )
      .leftJoinAndMapOne(
        'recipe.purchasedProduct',
        'recipe.purchasedProducts',
        'purchasedProduct',
        'purchasedProduct.type = :type AND purchasedProduct.clientId = :clientId',
        { type: ProductType.RECIPE, clientId },
      )
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('recipe.id = :id', { id });

    if (name)
      queryBuilder.andWhere('recipe.name LIKE :name', { name: `%${name}%` });

    if (sellerId)
      queryBuilder.andWhere('recipe.sellerId = :sellerId', { sellerId });

    if (hideFavoritedForClientId)
      queryBuilder.andWhere(
        'NOT EXISTS(SELECT 1 FROM favorites WHERE favorites.recipe_id = recipe.id AND favorites.client_id = :hideFavoritedForClientId)',
        {
          hideFavoritedForClientId,
        },
      );

    if (rating) queryBuilder.where('recipe.rating = :rating', { rating });

    if (orderByMostPurchased)
      queryBuilder
        .addSelect(
          `(SELECT
              COUNT(purchased_products.id)
            FROM
              purchased_products
            WHERE
              purchased_products.type = 'recipe' AND
              purchased_products.product_id = recipe.id)
          `,
          'recipe_purchased_times',
        )
        .addOrderBy('recipe_purchased_times', 'DESC');

    applySort({ sort, entityAlias: 'recipe', queryBuilder });

    const [recipes, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(recipes, total, perPage);
  }

  async paginateOrderedByHierarchy(
    {
      perPage,
      offset,
      filters: { name },
    }: RecipeByHierarchyPaginationOptionsDto,
    clientId: number,
  ): Promise<PaginationResult<Recipe>> {
    const queryBuilder = this.recipesRepository
      .createQueryBuilder('recipe')
      .select([
        'recipe.id',
        'recipe.name',
        'recipe.slug',
        'recipe.price',
        'recipe.preparationTime',
        'recipe.rating',
        `${this.getOrderValue()} as order_value`,
      ])
      .leftJoinAndSelect('recipe.recipeDifficulty', 'recipeDifficulty')
      .leftJoinAndSelect('recipe.categories', 'category')
      .leftJoinAndSelect('recipe.mealPeriods', 'mealPeriod')
      .leftJoinAndSelect('recipe.recipeImages', 'recipeImage')
      .leftJoinAndSelect('recipe.recipeVideos', 'recipeVideo')
      .leftJoinAndSelect('recipe.recipeSteps', 'recipeStep')
      .leftJoinAndSelect('recipe.recipeIngredients', 'recipeIngredient')
      .leftJoinAndSelect('recipeIngredient.measurementUnit', 'measurementUnit')
      .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
      .leftJoinAndSelect('recipe.seller', 'seller')
      .leftJoinAndMapOne(
        'recipe.clientRating',
        'recipe.ratings',
        'clientRating',
        'clientRating.itemType = :itemType AND clientRating.itemId = recipe.id AND clientRating.clientId = :clientId',
        { itemType: ProductType.RECIPE, clientId },
      )
      .leftJoinAndMapOne(
        'recipe.purchasedProduct',
        'recipe.purchasedProducts',
        'purchasedProduct',
        'purchasedProduct.type = :type AND purchasedProduct.clientId = :clientId',
        { type: ProductType.RECIPE, clientId },
      )
      .take(perPage)
      .skip(offset)
      .orderBy('order_value', 'ASC')
      .where(`${this.getOrderValue()} <= 3`)
      .setParameter('clientId', clientId);

    if (name)
      queryBuilder.andWhere('recipe.name LIKE :name', { name: `%${name}%` });

    const [recipes, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(recipes, total, perPage);
  }

  getOrderValue(): string {
    return `(CASE
        WHEN (SELECT
                1
            FROM
                favorites
            INNER JOIN
                purchased_products
            ON
                purchased_products.product_id = recipe.id AND purchased_products.type = 'recipe'
            WHERE	
                recipe.price > 0 AND
                favorites.recipe_id = recipe.id AND
                favorites.client_id = :clientId) THEN 0
        WHEN (SELECT
                1
            FROM
                favorites
            WHERE
                recipe.price = 0 AND
                favorites.recipe_id = recipe.id AND
                favorites.client_id = :clientId) THEN 1
        WHEN (SELECT
                1
            FROM
                purchased_products
            WHERE
                recipe.price > 0 and
                purchased_products.product_id = recipe.id AND
                purchased_products.type = 'recipe' AND
                purchased_products.client_id = :clientId) THEN 2
        WHEN (SELECT
                1
            FROM
                purchased_products
            WHERE
                recipe.price = 0 AND
                purchased_products.product_id = recipe.id AND
                purchased_products.type = 'recipe' AND
                purchased_products.client_id = :clientId) THEN 3
        ELSE 4
    END)`;
  }

  async create(
    {
      categoryIds,
      mealPeriodIds,
      recipeVideos,
      recipeIngredients,
      recipeSteps,
      ...createRecipeDto
    }: CreateRecipeDto,
    images: Express.Multer.File[],
  ): Promise<Recipe> {
    if (images.length === 0) {
      throw new AtLeastOneImageIsRequiredException();
    }

    const mappedImages = await Promise.all(
      images.map(async (image) => ({
        ...image,
        path: await this.fileRenamer.rename({
          filePath: image.path,
          itemName: createRecipeDto.name,
        }),
      })),
    );

    const recipe = Recipe.create({
      ...createRecipeDto,
      categories: await this.categoriesRepository.find({ id: In(categoryIds) }),
      mealPeriods: await this.mealPeriodsRepository.find({
        id: In(mealPeriodIds),
      }),
      recipeVideos: recipeVideos.map((recipeVideos) =>
        RecipeVideo.create(recipeVideos),
      ),
      recipeIngredients: recipeIngredients.map((recipeIngredient) =>
        RecipeIngredient.create(recipeIngredient),
      ),
      recipeImages: mappedImages.map((imageFile) =>
        RecipeImage.create({ path: imageFile.path }),
      ),
      recipeSteps: recipeSteps.map((recipeStep, i) =>
        RecipeStep.create({ ...recipeStep, order: i + 1 }),
      ),
    });

    return await this.recipesRepository.save(recipe);
  }

  async findOne(
    idOrSlug: number | string,
    bySlug: boolean = false,
    clientId: number = 0,
  ): Promise<Recipe> {
    const queryBuilder = this.recipesRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.recipeDifficulty', 'recipeDifficulty')
      .leftJoinAndSelect('recipe.categories', 'category')
      .leftJoinAndSelect('recipe.mealPeriods', 'mealPeriod')
      .leftJoinAndSelect('recipe.recipeImages', 'recipeImage')
      .leftJoinAndSelect('recipe.recipeVideos', 'recipeVideo')
      .leftJoinAndSelect('recipe.recipeSteps', 'recipeStep')
      .leftJoinAndSelect('recipe.recipeIngredients', 'recipeIngredient')
      .leftJoinAndSelect('recipeIngredient.measurementUnit', 'measurementUnit')
      .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
      .leftJoinAndSelect('recipe.seller', 'seller')
      .leftJoinAndMapOne(
        'recipe.saved',
        'recipe.saveds',
        'savedByUser',
        `savedByUser.clientId = :clientId AND type = '${SavedType.RECIPE}'`,
        { clientId },
      )
      .leftJoinAndMapOne(
        'recipe.clientRating',
        'recipe.ratings',
        'clientRating',
        'clientRating.itemType = :itemType AND clientRating.itemId = recipe.id AND clientRating.clientId = :clientId',
        { itemType: ProductType.RECIPE, clientId },
      )
      .leftJoinAndMapOne(
        'recipe.purchasedProduct',
        'recipe.purchasedProducts',
        'purchasedProduct',
        'purchasedProduct.type = :type AND purchasedProduct.clientId = :clientId',
        { type: ProductType.RECIPE, clientId },
      )
      .leftJoinAndSelect('recipe.comments', 'comment')
      .leftJoinAndSelect('comment.client', 'client');

    if (bySlug) {
      queryBuilder.where('recipe.slug = :slug', { slug: idOrSlug });
    } else {
      queryBuilder.where('recipe.id = :id', { id: idOrSlug });
    }

    const recipe = await queryBuilder.getOne();

    if (!recipe) {
      throw new RecipeNotFoundException();
    }

    return recipe;
  }

  async update({
    id,
    role,
    sellerId,
    categoryIds,
    mealPeriodIds,
    recipeVideos,
    recipeIngredients,
    recipeSteps,
    ...updateRecipeDto
  }: UpdateRecipeDto): Promise<Recipe> {
    const queryBuilder = this.recipesRepository
      .createQueryBuilder('recipe')
      .where('recipe.id = :id', { id });

    if (role !== Role.ADMIN) {
      queryBuilder.andWhere('recipe.sellerId = :sellerId', { sellerId });
    }

    const recipe = await queryBuilder.getOne();

    if (!recipe) {
      throw new RecipeNotFoundException();
    }

    await this.recipeIngredientsRepository
      .createQueryBuilder('recipeIngredient')
      .delete()
      .from(RecipeIngredient)
      .where('recipeId = :recipeId', { recipeId: recipe.id })
      .execute();

    await this.recipeVideosRepository
      .createQueryBuilder('recipeVideo')
      .delete()
      .from(RecipeVideo)
      .where('recipeId = :recipeId', { recipeId: recipe.id })
      .execute();

    await this.recipeStepsRepository
      .createQueryBuilder('recipeStep')
      .delete()
      .from(RecipeStep)
      .where('recipeId = :recipeId', { recipeId: recipe.id })
      .execute();

    Object.assign<Recipe, Partial<Recipe>>(recipe, {
      ...updateRecipeDto,
      categories: await this.categoriesRepository.find({ id: In(categoryIds) }),
      mealPeriods: await this.mealPeriodsRepository.find({
        id: In(mealPeriodIds),
      }),
      recipeVideos: recipeVideos.map((recipeVideos) =>
        RecipeVideo.create(recipeVideos),
      ),
      recipeIngredients: recipeIngredients.map((recipeIngredient) =>
        RecipeIngredient.create(recipeIngredient),
      ),
      recipeSteps: recipeSteps.map((recipeStep, i) =>
        RecipeStep.create({ ...recipeStep, order: i + 1 }),
      ),
    });

    return await this.recipesRepository.save(recipe);
  }

  async delete({ id, role, sellerId }: DeleteRecipeDto): Promise<void> {
    const queryBuilder = this.recipesRepository
      .createQueryBuilder('recipe')
      .where('recipe.id = :id', { id });

    if (role !== Role.ADMIN) {
      queryBuilder.andWhere('recipe.sellerId = :sellerId', { sellerId });
    }

    const recipe = await queryBuilder.getOne();

    if (!recipe) {
      throw new RecipeNotFoundException();
    }

    await this.recipesRepository.softRemove(recipe);
  }

  async deleteMultiple({
    ids,
    role,
    sellerId,
  }: DeleteMultipleRecipesDto): Promise<void> {
    const queryBuilder = this.recipesRepository
      .createQueryBuilder('recipe')
      .softDelete()
      .where('id IN(:...ids)', { ids });

    if (role !== Role.ADMIN) {
      queryBuilder.andWhere('sellerId = :sellerId', { sellerId });
    }

    await queryBuilder.execute();
  }

  async createRecipeImage({
    id,
    sellerId,
    role,
    image,
  }: CreateRecipeImageDto): Promise<RecipeImage> {
    const queryBuilder = this.recipesRepository
      .createQueryBuilder('recipe')
      .where('recipe.id = :id', { id });

    if (role !== Role.ADMIN) {
      queryBuilder.andWhere('recipe.sellerId = :sellerId', { sellerId });
    }

    const recipe = await queryBuilder.getOne();

    if (!recipe) {
      throw new RecipeNotFoundException();
    }

    const recipeImage = RecipeImage.create({
      path: await this.fileRenamer.rename({
        filePath: image.path,
        itemName: recipe.name,
      }),
      recipe,
    });

    return await this.recipeImagesRepository.save(recipeImage);
  }

  async deleteRecipeImage({
    id,
    imageId,
    sellerId,
    role,
  }: DeleteRecipeImageDto): Promise<void> {
    const queryBuilder = this.recipeImagesRepository
      .createQueryBuilder('recipeImage')
      .innerJoin('recipeImage.recipe', 'recipe')
      .where('recipeImage.id = :imageId', { imageId })
      .andWhere('recipe.id = :id', { id });

    if (role !== Role.ADMIN) {
      queryBuilder.andWhere('recipe.sellerId = :sellerId', { sellerId });
    }

    const recipeImage = await queryBuilder.getOne();

    if (!recipeImage) {
      throw new RecipeImageNotFoundException();
    }

    await this.recipeImagesRepository.remove(recipeImage);
  }
}
