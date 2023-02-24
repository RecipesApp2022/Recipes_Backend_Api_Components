import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { Occupation } from './entities/occupation.entity';

@Injectable()
export class OccupationsService {
    constructor(@InjectRepository(Occupation) private readonly occupationsRepository: Repository<Occupation>) {}

    async paginate({perPage, offset}: PaginationOptions): Promise<PaginationResult<Occupation>> {
        const queryRunner = this.occupationsRepository.createQueryBuilder('occupation')
            .take(perPage)
            .skip(offset);

        const [occupations, total] = await queryRunner.getManyAndCount();

        return new PaginationResult(occupations, total, perPage);
    }
}
