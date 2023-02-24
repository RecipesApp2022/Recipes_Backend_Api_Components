import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { applySort } from 'src/database/utils/sort';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { DeleteMultipleIngredientsDto } from './dto/delete-multiple-ingredients.dto';
import { IngredientPaginationOptionsDto } from './dto/ingredient-pagination-options.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientNotFoundException } from './errors/ingredient-not-found.exception';

@Injectable()
export class IngredientsService {
    constructor(@InjectRepository(Ingredient) private readonly ingredientsRepository: Repository<Ingredient>) {}

    async paginate({perPage, offset, filters: {
        id,
        name,
        ingredientTypeId,
    }, sort}: IngredientPaginationOptionsDto): Promise<PaginationResult<Ingredient>> {
        const queryBuilder = this.ingredientsRepository.createQueryBuilder('ingredient')
            .innerJoinAndSelect('ingredient.ingredientType', 'ingredientType')
            .take(perPage)
            .skip(offset);

        if (id) queryBuilder.andWhere('ingredient.id = :id', { id });

        if (name) queryBuilder.andWhere('ingredient.name LIKE :name', { name: `%${name}%` });

        if (ingredientTypeId) queryBuilder.andWhere('ingredient.ingredientTypeId = :ingredientTypeId', { ingredientTypeId });

        applySort({ sort, entityAlias: 'ingredient', queryBuilder });

        const [ingredients, total] = await queryBuilder.getManyAndCount();

        return new PaginationResult(ingredients, total, perPage);
    }

    async create({icon, ...createIngredientDto}: CreateIngredientDto): Promise<Ingredient> {
        const ingredient = Ingredient.create({
            ...createIngredientDto,
            icon: icon.path,
        });

        return await this.ingredientsRepository.save(ingredient);
    }

    async findOne(id: number): Promise<Ingredient> {
        const ingredient = await this.ingredientsRepository.createQueryBuilder('ingredient')
            .innerJoinAndSelect('ingredient.ingredientType', 'ingredientType')
            .where('ingredient.id = :id',  { id })
            .getOne();

        if (!ingredient) {
            throw new IngredientNotFoundException();
        }

        return ingredient;
    }

    async update({id, icon, ...updateIngredientDto}: UpdateIngredientDto): Promise<Ingredient> {
        const ingredient = await this.ingredientsRepository.createQueryBuilder('ingredient')
            .where('ingredient.id = :id',  { id })
            .getOne();

        if (!ingredient) {
            throw new IngredientNotFoundException();
        }

        Object.assign(ingredient, updateIngredientDto);

        if (icon) {
            ingredient.icon = icon.path;
        }

        return await this.ingredientsRepository.save(ingredient);
    }
    
    async delete(id: number): Promise<void> {
        const ingredient = await this.ingredientsRepository.createQueryBuilder('ingredient')
            .where('ingredient.id = :id',  { id })
            .getOne();

        if (!ingredient) {
            throw new IngredientNotFoundException();
        }
    
        await this.ingredientsRepository.softRemove(ingredient);
    }

    async deleteMultiple({ ids }: DeleteMultipleIngredientsDto): Promise<void> {
        await this.ingredientsRepository.softDelete(ids);
    }
}
