import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { MealPeriod } from './entities/meal-period.entity';

@Injectable()
export class MealPeriodsService {
    constructor(@InjectRepository(MealPeriod) private readonly mealPeriodsRepository: Repository<MealPeriod>) {}

    async paginate({ perPage, offset }: PaginationOptions): Promise<PaginationResult<MealPeriod>> {
        const [mealPeriods, total] = await this.mealPeriodsRepository.createQueryBuilder('mealPeriod')
            .take(perPage)
            .skip(offset)
            .getManyAndCount();

        return new PaginationResult(mealPeriods, total, perPage);
    }
}
