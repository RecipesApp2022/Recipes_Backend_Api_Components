import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays, differenceInDays, format } from 'date-fns';
import { EntityIdIsRequiredException } from 'src/comments/errors/entity-id-is-required.exception';
import { OnlyOneEntityAllowedException } from 'src/comments/errors/only-one-entity-allowed.exception';
import { applySort } from 'src/database/utils/sort';
import { Plan } from 'src/plans/entities/plan.entity';
import { PlanNotFoundException } from 'src/plans/errors/plan-not-found.exception';
import { Recipe } from 'src/recipes/entities/recipes.entity';
import { RecipeNotFoundException } from 'src/recipes/errors/recipe-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { DeleteEventDto } from './dto/delete-event.dto';
import { EventPaginationOptionsDto } from './dto/event-pagination-options.dto';
import { FindRecipesForDayDto } from './dto/find-recipes-for-day.dto';
import { Event } from './entities/event.entity';
import { EventNotFoundException } from './errors/event-not-found.exception';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(Plan) private readonly plansRepository: Repository<Plan>,
  ) {}

  async paginate({
    perPage,
    offset,
    filters: { id, start, end, clientId },
    sort,
  }: EventPaginationOptionsDto): Promise<PaginationResult<Event>> {
    const queryBuilder = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.recipe', 'recipe')
      .leftJoinAndSelect('event.plan', 'plan')
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('event.id = :id', { id });

    if (start) queryBuilder.andWhere('event.start >= :start', { start });

    if (end) queryBuilder.andWhere('event.end <= :end', { end });

    if (clientId)
      queryBuilder.andWhere('event.clientId = :clientId', { clientId });

    applySort({ sort, entityAlias: 'event', queryBuilder });

    const [events, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(events, total, perPage);
  }

  async create({
    recipeId,
    planId,
    start,
    ...createEventDto
  }: CreateEventDto): Promise<Event> {
    const noOwnerEntityIdProvided = !recipeId && !planId;

    if (noOwnerEntityIdProvided) {
      throw new EntityIdIsRequiredException();
    }

    const moreThanOneEntitySelected = recipeId && planId;

    if (moreThanOneEntitySelected) {
      throw new OnlyOneEntityAllowedException();
    }

    let daysToAdd = 0;
    let plan: Plan = null;
    let recipe: Recipe = null;

    if (recipeId) {
      recipe = await this.recipesRepository.findOne(recipeId);

      if (!recipe) {
        throw new RecipeNotFoundException();
      }
    }

    if (planId) {
      plan = await this.plansRepository.findOne(planId);

      if (!plan) {
        throw new PlanNotFoundException();
      }

      daysToAdd = plan.numberOfDays;
    }

    const event = Event.create({
      ...createEventDto,
      recipe,
      plan,
      start,
      end: recipeId ? start : addDays(start, daysToAdd),
    });

    return await this.eventsRepository.save(event);
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.recipe', 'recipe')
      .leftJoinAndSelect('event.plan', 'plan')
      .where('event.id = :id', { id })
      .getOne();

    if (!event) {
      throw new EventNotFoundException();
    }

    return event;
  }

  async delete({ id, clientId }: DeleteEventDto): Promise<void> {
    const event = await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.recipe', 'recipe')
      .leftJoinAndSelect('event.plan', 'plan')
      .where('event.id = :id', { id })
      .andWhere('event.clientId = :clientId', { clientId })
      .getOne();

    if (!event) {
      throw new EventNotFoundException();
    }

    await this.eventsRepository.remove(event);
  }

  async findRecipesForDay({
    clientId,
    date,
  }: FindRecipesForDayDto): Promise<Recipe[]> {
    const events = await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.recipe', 'recipe')
      .leftJoinAndSelect('recipe.recipeImages', 'recipeImage')
      .leftJoinAndSelect('recipe.recipeIngredients', 'recipeIngredient')
      .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
      .leftJoinAndSelect('recipeIngredient.measurementUnit', 'measurementUnit')
      .leftJoinAndSelect('event.plan', 'plan')
      .leftJoinAndSelect('plan.planDays', 'planDay')
      .leftJoinAndSelect('planDay.planDayRecipes', 'planDayRecipe')
      .leftJoinAndSelect('planDayRecipe.recipe', 'planRecipe')
      .leftJoinAndSelect('planRecipe.recipeImages', 'planRecipeImages')
      .leftJoinAndSelect('planRecipe.recipeIngredients', 'planRecipeIngredient')
      .leftJoinAndSelect('planRecipeIngredient.ingredient', 'planIngredient')
      .leftJoinAndSelect(
        'planRecipeIngredient.measurementUnit',
        'planMeasurementUnit',
      )
      .where('event.clientId = :clientId', { clientId })
      .andWhere('event.start <= :date AND event.end >= :date', { date })
      .getMany();

    const recipes = events.reduce((result, { recipe, plan, start }) => {
      if (recipe) {
        return [...result, recipe];
      }

      if (!plan) {
        return result;
      }

      const dateAtMidnight = new Date(format(date, 'yyyy-MM-dd'));
      const startAtMidnight = new Date(format(start, 'yyyy-MM-dd'));
      const planDayIndex = differenceInDays(dateAtMidnight, startAtMidnight);
      const recipes =
        plan.fullPlanDays?.[planDayIndex]?.planDayRecipes
          ?.map(({ recipe }) => {
            if (!recipe) {
              return null;
            }

            return Recipe.create({
              ...recipe,
              name: `${plan.name} - ${recipe.name}`,
            });
          })
          .filter((recipe) => recipe) ?? [];

      return [...result, ...recipes];
    }, []);

    return recipes;
  }
}
