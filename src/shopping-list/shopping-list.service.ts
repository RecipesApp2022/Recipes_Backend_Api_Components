import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  addDays,
  differenceInDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { groupBy } from 'lodash';
import nodeHtmlToImage from 'node-html-to-image';
import { join } from 'path';
import { EventsService } from 'src/events/events.service';
import { RecipeIngredient } from 'src/recipes/entities/recipe-ingredient.entity';
import { Recipe } from 'src/recipes/entities/recipes.entity';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { basepath } from 'src/support/path-utilities';
import { Repository } from 'typeorm';
import { GenerateShoppingListImageDto } from './dto/generate-shopping-list-image.dto';
import { GenerateShoppingListDto } from './dto/generate-shopping-list.dto';
import { ShoppingListItem } from './dto/shopping-list-item.dto';
import { ShoppingListPaginationOptionsDto } from './dto/shopping-list-pagination-options.dto';
import { StoreShoppingListImage } from './dto/store-shopping-list-image.dto';
import { ShoppingList } from './entities/shopping-list.entity';
import { ShoppingListType } from './types/shopping-list-type';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListRepository: Repository<ShoppingList>,
    private readonly eventsService: EventsService,
  ) {}

  async paginate({
    perPage,
    offset,
    filters: { id, name, clientId },
  }: ShoppingListPaginationOptionsDto): Promise<
    PaginationResult<ShoppingList>
  > {
    const queryBuilder = this.shoppingListRepository
      .createQueryBuilder('shoppingList')
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('shoppingList.id = :id', { id });

    if (name)
      queryBuilder.andWhere('shoppingList.name LIKE :name', {
        name: `%${name}%`,
      });

    if (clientId)
      queryBuilder.andWhere('shoppingList.clientId = :clientId', { clientId });

    const [shoppingLists, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(shoppingLists, total, perPage);
  }

  async generate({
    type,
    clientId,
  }: GenerateShoppingListDto): Promise<ShoppingListItem[]> {
    const dates = this.getDates(type);

    const recipes: Recipe[] = [];

    for (const date of dates) {
      const localRecipes = await this.eventsService.findRecipesForDay({
        clientId,
        date,
      });

      recipes.push(...localRecipes);
    }

    const recipeIngredients: RecipeIngredient[] = recipes.flatMap(
      (r) => r.recipeIngredients,
    );

    const groupedRecipeIngredientsIngredientId = Object.values(
      groupBy(recipeIngredients, 'ingredient.id'),
    );

    const ingredients = groupedRecipeIngredientsIngredientId.map((riArr) => {
      const firstIngredient = riArr[0].ingredient;

      const groupedRecipeIngredientsByUnitId = Object.values(
        groupBy(riArr, 'measurementUnit.id'),
      );

      const measurementUnitsWithQuantity = groupedRecipeIngredientsByUnitId.map(
        (riArr) => ({
          ...riArr[0].measurementUnit,
          quantity: riArr.reduce((total, ri) => total + ri.value, 0),
        }),
      );

      return {
        ...firstIngredient,
        measurementUnits: measurementUnitsWithQuantity,
      };
    });

    return ingredients;
  }

  getDates(type: ShoppingListType): Date[] {
    const currDate = new Date();

    let startDate: Date;
    let endDate: Date;

    if (type === 'today') {
      startDate = startOfDay(currDate);
      endDate = endOfDay(currDate);
    } else if (type === 'weekly') {
      startDate = startOfWeek(currDate, { weekStartsOn: 1 });
      endDate = endOfWeek(currDate, { weekStartsOn: 1 });
    } else if (type === 'monthly') {
      startDate = startOfMonth(currDate);
      endDate = endOfMonth(currDate);
    }

    const numberOfDays = differenceInDays(endDate, startDate) + 1;

    const dates = [...Array(numberOfDays).keys()].map(
      (n) => addDays(startDate, n),
      'yyyy-MM-dd',
    );

    return dates;
  }

  async generateImage({ ingredients, asBase64 }: GenerateShoppingListImageDto) {
    const templatesPath = join(__dirname, '..', '..', '..', 'templates');

    const shoppingListTemplatePath = join(templatesPath, 'shopping-list.hbs');

    const html = readFileSync(shoppingListTemplatePath).toString();

    const encoding = asBase64 ? 'base64' : 'binary';

    const image = (await nodeHtmlToImage({
      html,
      content: { ingredients },
      encoding,
    })) as string | Buffer;

    return image;
  }

  async storeImage({
    clientId,
    ...storeShoppingListImage
  }: StoreShoppingListImage) {
    const image = await this.generateImage({
      ...storeShoppingListImage,
      asBase64: false,
    });

    const clientSLPath = basepath('uploads', 'shopping-list');

    const pathExists = existsSync(clientSLPath);

    if (!pathExists) {
      mkdirSync(clientSLPath);
    }

    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

    const filePath = join(clientSLPath, fileName);

    writeFileSync(filePath, image, 'binary');

    const shoppingList = ShoppingList.create({
      name: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      path: `uploads/${fileName}`,
      clientId,
    });

    return await this.shoppingListRepository.save(shoppingList);
  }
}
