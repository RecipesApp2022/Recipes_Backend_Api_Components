import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { applySort } from 'src/database/utils/sort';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { IngredientTypePaginationOptionsDto } from './dto/ingredient-type-pagination-options.dto';
import { IngredientType } from './entities/ingredient-type.entity';

@Injectable()
export class IngredientTypesService {
    constructor(@InjectRepository(IngredientType) private readonly ingredientTypesRepository: Repository<IngredientType>) {}

    async paginate({perPage, offset, filters: {
        id,
        name,
    }, sort}: IngredientTypePaginationOptionsDto): Promise<PaginationResult<IngredientType>> {
        const queryBuilder = this.ingredientTypesRepository.createQueryBuilder('ingredientType')
            .take(perPage)
            .skip(offset);

        if (id) queryBuilder.andWhere('ingredientType.id = :id', { id });

        if (name) queryBuilder.andWhere('ingredientType.name LIKE :name', { name: `%${name}%` });

        applySort({ sort, entityAlias: 'ingredientType', queryBuilder });

        const [ingredientTypes, total] = await queryBuilder.getManyAndCount();

        return new PaginationResult(ingredientTypes, total, perPage);
    }
}
