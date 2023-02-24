import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { applySort } from 'src/database/utils/sort';
import { ProductType } from 'src/orders/enums/product-type.enum';
import { Plan } from 'src/plans/entities/plan.entity';
import { AtLeastOneImageIsRequiredException } from 'src/plans/errors/at-least-one-image-is-required.exception';
import { Recipe } from 'src/recipes/entities/recipes.entity';
import { SavedType } from 'src/saved/enum/saved-type.enum';
import { FileRenamer } from 'src/support/file-renamer';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { ComboPaginationOptionsDto } from './dto/combo-pagination-options.dto';
import { CreateComboImageDto } from './dto/create-combo-image-dto';
import { CreateComboDto } from './dto/create-combo.dto';
import { DeleteComboImageDto } from './dto/delete-combo-image.dto';
import { DeleteComboDto } from './dto/delete-combo.dto';
import { DeleteMultipleCombosDto } from './dto/delete-multiple-combos.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { ComboImage } from './entities/combo-image.entity';
import { Combo } from './entities/combo.entity';
import { ComboImageNotFoundException } from './errors/combo-image-not-found.exception';
import { ComboNotFoundException } from './errors/combo-not-found.exception';

@Injectable()
export class CombosService {
  constructor(
    @InjectRepository(Combo)
    private readonly combosRepository: Repository<Combo>,
    @InjectRepository(ComboImage)
    private readonly comboImagesRepository: Repository<ComboImage>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(Plan) private readonly plansRepository: Repository<Plan>,
    private readonly fileRenamer: FileRenamer,
  ) {}

  async paginate(
    {
      perPage,
      offset,
      filters: {
        id,
        sellerId,
        name,
        hideFavoritedForClientId,
        rating,
        orderByMostPurchased,
      },
      sort,
    }: ComboPaginationOptionsDto,
    clientId: number,
  ): Promise<PaginationResult<Combo>> {
    const queryBuilder = this.combosRepository
      .createQueryBuilder('combo')
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
      .leftJoinAndSelect('combo.categories', 'category')
      .leftJoinAndSelect('combo.comboImages', 'comboImage')
      .leftJoinAndSelect('combo.seller', 'seller')
      .leftJoinAndMapOne(
        'combo.saved',
        'combo.saveds',
        'savedByUser',
        `savedByUser.clientId = :clientId AND type = '${SavedType.COMBO}'`,
        { clientId },
      )
      .leftJoinAndMapOne(
        'combo.clientRating',
        'combo.ratings',
        'clientRating',
        'clientRating.itemType = :itemType AND clientRating.itemId = combo.id AND clientRating.clientId = :clientId',
        { itemType: ProductType.COMBO, clientId },
      )
      .leftJoinAndMapOne(
        'combo.purchasedProduct',
        'combo.purchasedProducts',
        'purchasedProduct',
        'purchasedProduct.type = :type AND purchasedProduct.clientId = :clientId',
        { type: ProductType.COMBO, clientId },
      )
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('combo.id = :id', { id });

    if (sellerId)
      queryBuilder.andWhere('combo.sellerId = :sellerId', { sellerId });

    if (hideFavoritedForClientId)
      queryBuilder.andWhere(
        'NOT EXISTS(SELECT 1 FROM favorites WHERE favorites.combo_id = combo.id AND favorites.client_id = :hideFavoritedForClientId)',
        {
          hideFavoritedForClientId,
        },
      );

    if (name)
      queryBuilder.andWhere('combo.name LIKE :name', { name: `%${name}%` });

    if (rating) queryBuilder.where('combo.rating = :rating', { rating });

    if (orderByMostPurchased)
      queryBuilder
        .addSelect(
          `(SELECT
            COUNT(purchased_products.id)
          FROM
            purchased_products
          WHERE
            purchased_products.type = 'combo' AND
            purchased_products.product_id = combo.id)
        `,
          'combo_purchased_times',
        )
        .addOrderBy('combo_purchased_times', 'DESC');

    applySort({ sort, entityAlias: 'combo', queryBuilder });

    const [combos, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(combos, total, perPage);
  }

  async create(
    { categoryIds, recipeIds, planIds, ...createComboDto }: CreateComboDto,
    images: Express.Multer.File[],
  ): Promise<Combo> {
    if (images.length === 0) {
      throw new AtLeastOneImageIsRequiredException();
    }

    const renamedImages = await this.fileRenamer.renameMulterFiles({
      images,
      itemName: createComboDto.name,
    });

    const combo = Combo.create({
      ...createComboDto,
      categories: await this.categoriesRepository.findByIds(categoryIds),
      comboImages: renamedImages.map((image) =>
        ComboImage.create({ path: image.path }),
      ),
      recipes: await this.recipesRepository.findByIds(recipeIds),
      plans: await this.plansRepository.findByIds(planIds),
    });

    return await this.combosRepository.save(combo);
  }

  async findOne(
    idOrSlug: number | string,
    bySlug: boolean = false,
    clientId: number = 0,
  ): Promise<Combo> {
    const queryBuilder = this.combosRepository
      .createQueryBuilder('combo')
      .leftJoinAndSelect('combo.recipes', 'comboRecipe')
      .leftJoinAndSelect(
        'comboRecipe.recipeIngredients',
        'comboRecipeRecipeIngredients',
      )
      .leftJoinAndSelect('comboRecipe.recipeImages', 'comboRecipeRecipeImages')
      .leftJoinAndSelect('combo.plans', 'comboPlan')
      .leftJoinAndSelect('comboPlan.planImages', 'comboPlanImages')
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
      .leftJoinAndSelect('combo.categories', 'category')
      .leftJoinAndSelect('combo.comboImages', 'comboImage')
      .leftJoinAndSelect('combo.seller', 'seller')
      .leftJoinAndMapOne(
        'combo.saved',
        'combo.saveds',
        'savedByUser',
        `savedByUser.clientId = :clientId AND type = '${SavedType.COMBO}'`,
        { clientId },
      )
      .leftJoinAndMapOne(
        'combo.clientRating',
        'combo.ratings',
        'clientRating',
        'clientRating.itemType = :itemType AND clientRating.itemId = combo.id AND clientRating.clientId = :clientId',
        { itemType: ProductType.COMBO, clientId },
      )
      .leftJoinAndMapOne(
        'combo.purchasedProduct',
        'combo.purchasedProducts',
        'purchasedProduct',
        'purchasedProduct.type = :type AND purchasedProduct.clientId = :clientId',
        { type: ProductType.COMBO, clientId },
      )
      .leftJoinAndSelect('combo.comments', 'comment')
      .leftJoinAndSelect('comment.client', 'client');

    if (bySlug) {
      queryBuilder.where('combo.slug = :slug', { slug: idOrSlug });
    } else {
      queryBuilder.where('combo.id = :id', { id: idOrSlug });
    }

    const combo = await queryBuilder.getOne();

    if (!combo) {
      throw new ComboNotFoundException();
    }

    return combo;
  }

  async update({
    id,
    sellerId,
    categoryIds,
    recipeIds,
    planIds,
    ...updateComboDto
  }: UpdateComboDto): Promise<Combo> {
    const combo = await this.combosRepository
      .createQueryBuilder('combo')
      .where('combo.id = :id', { id })
      .andWhere('combo.sellerId = :sellerId', { sellerId })
      .getOne();

    if (!combo) {
      throw new ComboNotFoundException();
    }

    Object.assign<Combo, Partial<Combo>>(combo, {
      ...updateComboDto,
      categories: await this.categoriesRepository.findByIds(categoryIds),
      recipes: await this.recipesRepository.findByIds(recipeIds),
      plans: await this.plansRepository.findByIds(planIds),
    });

    return await this.combosRepository.save(combo);
  }

  async delete({ id, sellerId }: DeleteComboDto): Promise<void> {
    const combo = await this.combosRepository
      .createQueryBuilder('combo')
      .where('combo.id = :id', { id })
      .andWhere('combo.sellerId = :sellerId', { sellerId })
      .getOne();

    if (!combo) {
      throw new ComboNotFoundException();
    }

    await this.combosRepository.softRemove(combo);
  }

  async deleteMultiple({ ids }: DeleteMultipleCombosDto): Promise<void> {
    await this.combosRepository.softDelete(ids);
  }

  async createComboImage({
    id,
    sellerId,
    image,
  }: CreateComboImageDto): Promise<ComboImage> {
    const combo = await this.combosRepository
      .createQueryBuilder('combo')
      .where('combo.id = :id', { id })
      .andWhere('combo.sellerId = :sellerId', { sellerId })
      .getOne();

    if (!combo) {
      throw new ComboNotFoundException();
    }

    const comboImage = ComboImage.create({
      path: await this.fileRenamer.rename({
        filePath: image.path,
        itemName: combo.name,
      }),
      combo,
    });

    return await this.comboImagesRepository.save(comboImage);
  }

  async deleteComboImage({
    id,
    imageId,
    sellerId,
  }: DeleteComboImageDto): Promise<void> {
    const comboImage = await this.comboImagesRepository
      .createQueryBuilder('comboImage')
      .innerJoin('comboImage.combo', 'combo')
      .where('comboImage.id = :imageId', { imageId })
      .andWhere('combo.id = :id', { id })
      .andWhere('combo.sellerId = :sellerId', { sellerId })
      .getOne();

    if (!comboImage) {
      throw new ComboImageNotFoundException();
    }

    await this.comboImagesRepository.remove(comboImage);
  }
}
