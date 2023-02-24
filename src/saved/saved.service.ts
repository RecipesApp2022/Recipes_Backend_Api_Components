import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { applySort } from 'src/database/utils/sort';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { SavedPaginationOptionsDto } from './dto/saved-pagination-options.dto';
import { ToggleSavedDto } from './dto/toggle-saved.dto';
import { Saved } from './entities/saved.entity';
import { SavedType } from './enum/saved-type.enum';

@Injectable()
export class SavedService {
    constructor(@InjectRepository(Saved) private readonly savedRepository: Repository<Saved>) {}

    async paginate({ perPage, offset, filters: {
        id,
        types,
        clientId,
    }, sort}: SavedPaginationOptionsDto): Promise<PaginationResult<Saved>> {
        const queryBuilder = this.savedRepository.createQueryBuilder('saved')
            .leftJoinAndSelect('saved.recipe', 'recipe')
            .leftJoinAndSelect('recipe.recipeImages', 'recipeImage')
            .leftJoinAndSelect('recipe.mealPeriods', 'mealPeriod')
            .leftJoinAndSelect('recipe.seller', 'recipeSeller')
            .leftJoinAndSelect('recipe.recipeIngredients', 'recipeRecipeIngredient')
            .leftJoinAndSelect('saved.plan', 'plan')
            .leftJoinAndSelect('plan.planImages', 'planImage')
            .leftJoinAndSelect('plan.seller', 'planSeller')
            .leftJoinAndSelect('plan.planDays', 'planDay')
            .leftJoinAndSelect('planDay.planDayRecipes', 'planDayRecipe')
            .leftJoinAndSelect('planDayRecipe.recipe', 'planDayRecipeRecipe')
            .leftJoinAndSelect('planDayRecipeRecipe.recipeIngredients', 'planDayRecipeRecipeReciprecipeIngredient')
            .leftJoinAndSelect('saved.combo', 'combo')
            .leftJoinAndSelect('combo.comboImages', 'comboImage')
            .leftJoinAndSelect('combo.seller', 'comboSeller')
            .leftJoinAndSelect('combo.recipes', 'comboRecipe')
            .leftJoinAndSelect('comboRecipe.recipeIngredients', 'comboRecipeRecipeIngredients')
            .leftJoinAndSelect('combo.plans', 'comboPlan')
            .leftJoinAndSelect('comboPlan.planDays', 'comboPlanPlanDay')
            .leftJoinAndSelect('comboPlanPlanDay.planDayRecipes', 'comboPlanPlanDayPlanDayRecipe')
            .leftJoinAndSelect('comboPlanPlanDayPlanDayRecipe.recipe', 'comboPlanPlanDayPlanDayRecipeRecipe')
            .leftJoinAndSelect('comboPlanPlanDayPlanDayRecipeRecipe.recipeIngredients', 'comboPlanPlanDayPlanDayRecipeRecipeRecipeIngredient')
            .take(perPage)
            .skip(offset);

        if (id) queryBuilder.andWhere('saved.id = :id', { id });

        if (types.length > 0) queryBuilder.andWhere('saved.type IN (:...types)', { types });

        if (clientId) queryBuilder.andWhere('saved.clientId = :clientId', { clientId });

        applySort({ sort, entityAlias: 'saved', queryBuilder });

        const [saveds, total] = await queryBuilder.getManyAndCount();

        return new PaginationResult(saveds, total, perPage);
    }

    async toggle({ clientId, type, recipeId, planId, comboId }: ToggleSavedDto): Promise<boolean> {
        const queryBuilder = this.savedRepository.createQueryBuilder('saved')
            .where('saved.clientId = :clientId', { clientId });
    
        switch(type) {
            case SavedType.RECIPE:
                queryBuilder.andWhere('saved.recipeId = :recipeId', { recipeId });
                break;
            case SavedType.PLAN:
                queryBuilder.andWhere('saved.planId = :planId', { planId });
                break;
            case SavedType.COMBO:
                queryBuilder.andWhere('saved.comboId = :comboId', { comboId });
                break;
        }

        const saved = await queryBuilder.getOne();

        let isSaved: boolean;

        if (saved) {
            await this.savedRepository.remove(saved);
            isSaved = false;
        } else {
            await this.savedRepository.save(Saved.create({
                clientId,
                type,
                recipeId,
                planId,
                comboId,
            }));
            isSaved = true;
        }

        return isSaved;
    }
}
