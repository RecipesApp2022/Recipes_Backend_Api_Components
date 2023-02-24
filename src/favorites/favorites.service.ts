import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Combo } from 'src/combos/entities/combo.entity';
import { applySort } from 'src/database/utils/sort';
import { Plan } from 'src/plans/entities/plan.entity';
import { Recipe } from 'src/recipes/entities/recipes.entity';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { DeleteFavoriteDto } from './dto/delete-favorite.dto';
import { FavoritePaginationOptionsDto } from './dto/favorite-pagination-options.dto';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { FavoriteType } from './enum/favorite-type.enum';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(Plan) private readonly plansRepository: Repository<Plan>,
    @InjectRepository(Combo)
    private readonly combosRepository: Repository<Combo>,
  ) {}

  async paginate({
    perPage,
    offset,
    filters: { id, types, reactions, clientId },
    sort,
  }: FavoritePaginationOptionsDto): Promise<PaginationResult<Favorite>> {
    const queryBuilder = this.favoritesRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.recipe', 'recipe')
      .leftJoinAndSelect('recipe.recipeImages', 'recipeImage')
      .leftJoinAndSelect('recipe.mealPeriods', 'mealPeriod')
      .leftJoinAndSelect('recipe.seller', 'recipeSeller')
      .leftJoinAndSelect('recipe.recipeIngredients', 'recipeRecipeIngredient')
      .leftJoinAndSelect('favorite.plan', 'plan')
      .leftJoinAndSelect('plan.planImages', 'planImage')
      .leftJoinAndSelect('plan.seller', 'planSeller')
      .leftJoinAndSelect('plan.planDays', 'planDay')
      .leftJoinAndSelect('planDay.planDayRecipes', 'planDayRecipe')
      .leftJoinAndSelect('planDayRecipe.recipe', 'planDayRecipeRecipe')
      .leftJoinAndSelect(
        'planDayRecipeRecipe.recipeIngredients',
        'planDayRecipeRecipeReciprecipeIngredient',
      )
      .leftJoinAndSelect('favorite.combo', 'combo')
      .leftJoinAndSelect('combo.comboImages', 'comboImage')
      .leftJoinAndSelect('combo.seller', 'comboSeller')
      .leftJoinAndSelect('combo.recipes', 'comboRecipe')
      .leftJoinAndSelect(
        'comboRecipe.recipeIngredients',
        'comboRecipeRecipeIngredients',
      )
      .leftJoinAndSelect('combo.plans', 'comboPlan')
      .leftJoinAndSelect('comboPlan.planDays', 'comboPlanPlanDay')
      .leftJoinAndSelect(
        'comboPlanPlanDay.planDayRecipes',
        'comboPlanPlanDayPlanDayRecipe',
      )
      .leftJoinAndSelect(
        'comboPlanPlanDayPlanDayRecipe.recipe',
        'comboPlanPlanDayPlanDayRecipeRecipe',
      )
      .leftJoinAndSelect(
        'comboPlanPlanDayPlanDayRecipeRecipe.recipeIngredients',
        'comboPlanPlanDayPlanDayRecipeRecipeRecipeIngredient',
      )
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('favorite.id = :id', { id });

    if (types.length > 0)
      queryBuilder.andWhere('favorite.type IN (:...types)', { types });

    if (reactions.length > 0)
      queryBuilder.andWhere('favorite.reaction IN (:...reactions)', {
        reactions,
      });

    if (clientId)
      queryBuilder.andWhere('favorite.clientId = :clientId', { clientId });

    applySort({ sort, entityAlias: 'favorite', queryBuilder });

    const [favorites, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(favorites, total, perPage);
  }

  async create({
    type,
    clientId,
    recipeId,
    planId,
    comboId,
    ...createFavoriteDto
  }: CreateFavoriteDto): Promise<{
    favorite: Favorite;
    nextSlug: string;
  }> {
    const queryBuilder = this.favoritesRepository
      .createQueryBuilder('favorite')
      .where('favorite.clientId = :clientId', { clientId });

    switch (type) {
      case FavoriteType.RECIPE:
        queryBuilder.andWhere('favorite.recipeId = :recipeId', { recipeId });
        break;
      case FavoriteType.PLAN:
        queryBuilder.andWhere('favorite.planId = :planId', { planId });
        break;
      case FavoriteType.COMBO:
        queryBuilder.andWhere('favorite.comboId = :comboId', { comboId });
        break;
    }

    const foundFavorite = await queryBuilder.getOne();

    let nextSlug: string;

    switch (type) {
      case FavoriteType.RECIPE:
        nextSlug = (
          await this.recipesRepository
            .createQueryBuilder('recipe')
            .where('recipe.id != :recipeId', { recipeId })
            .andWhere(
              'NOT EXISTS(SELECT 1 FROM favorites WHERE favorites.recipe_id = recipe.id AND favorites.client_id = :clientId)',
              { clientId },
            )
            .getOne()
        )?.slug;
        break;
      case FavoriteType.PLAN:
        nextSlug = (
          await this.plansRepository
            .createQueryBuilder('plan')
            .where('plan.id != :planId', { planId })
            .andWhere(
              'NOT EXISTS(SELECT 1 FROM favorites WHERE favorites.plan_id = plan.id AND favorites.client_id = :clientId)',
              { clientId },
            )
            .andWhere('plan.clientId IS NULL')
            .getOne()
        )?.slug;
        break;
      case FavoriteType.COMBO:
        nextSlug = (
          await this.combosRepository
            .createQueryBuilder('combo')
            .where('combo.id != :comboId', { comboId })
            .andWhere(
              'NOT EXISTS(SELECT 1 FROM favorites WHERE favorites.combo_id = combo.id AND favorites.client_id = :clientId)',
              { clientId },
            )
            .getOne()
        )?.slug;
        break;
    }

    const favorite = Favorite.create({
      ...createFavoriteDto,
      type,
      clientId,
      recipeId,
      planId,
      comboId,
    });

    return {
      favorite:
        foundFavorite ?? (await this.favoritesRepository.save(favorite)),
      nextSlug,
    };
  }

  async toggle({
    clientId,
    type,
    recipeId,
    planId,
    comboId,
  }: ToggleFavoriteDto): Promise<boolean> {
    const queryBuilder = this.favoritesRepository
      .createQueryBuilder('favorite')
      .where('favorite.clientId = :clientId', { clientId });

    switch (type) {
      case FavoriteType.RECIPE:
        queryBuilder.andWhere('favorite.recipeId = :recipeId', { recipeId });
        break;
      case FavoriteType.PLAN:
        queryBuilder.andWhere('favorite.planId = :planId', { planId });
        break;
      case FavoriteType.COMBO:
        queryBuilder.andWhere('favorite.comboId = :comboId', { comboId });
        break;
    }

    const favorite = await queryBuilder.getOne();

    let isFavorite: boolean;

    if (favorite) {
      await this.favoritesRepository.remove(favorite);
      isFavorite = false;
    } else {
      await this.favoritesRepository.save(
        Favorite.create({
          clientId,
          type,
          recipeId: type === FavoriteType.RECIPE ? recipeId : null,
          planId: type === FavoriteType.PLAN ? planId : null,
          comboId: type === FavoriteType.COMBO ? comboId : null,
        }),
      );
      isFavorite = true;
    }

    return isFavorite;
  }

  async delete({
    type,
    clientId,
    recipeId,
    planId,
    comboId,
  }: DeleteFavoriteDto): Promise<void> {
    const queryBuilder = this.favoritesRepository
      .createQueryBuilder('favorite')
      .where('favorite.clientId = :clientId', { clientId });

    switch (type) {
      case FavoriteType.RECIPE:
        queryBuilder.andWhere('favorite.recipeId = :recipeId', { recipeId });
        break;
      case FavoriteType.PLAN:
        queryBuilder.andWhere('favorite.planId = :planId', { planId });
        break;
      case FavoriteType.COMBO:
        queryBuilder.andWhere('favorite.comboId = :comboId', { comboId });
        break;
    }

    const favorite = await queryBuilder.getOne();

    if (favorite) {
      await this.favoritesRepository.remove(favorite);
    }
  }
}
