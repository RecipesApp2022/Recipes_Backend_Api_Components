import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { RecipeDifficulty } from './entities/recipe-difficulty.entity';

@Injectable()
export class RecipeDifficultiesService {
    constructor(@InjectRepository(RecipeDifficulty) private readonly recipeDifficultiesRepository: Repository<RecipeDifficulty>) {}

    async paginate({ perPage, offset }: PaginationOptions): Promise<PaginationResult<RecipeDifficulty>> {
        const [recipeDifficulties, total] = await this.recipeDifficultiesRepository.createQueryBuilder('recipeDifficulty')
            .take(perPage)
            .skip(offset)
            .getManyAndCount();

        return new PaginationResult(recipeDifficulties, total, perPage);
    }
}
