import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { AdPosition } from './entities/ad-position.entity';

@Injectable()
export class AdPositionsService {
    constructor(@InjectRepository(AdPosition) private readonly adPositionsRepository: Repository<AdPosition>) {}

    async paginate({ perPage, offset }: PaginationOptions): Promise<PaginationResult<AdPosition>> {
        const queryBuilder = this.adPositionsRepository.createQueryBuilder('adPosition')
            .take(perPage)
            .skip(offset);

        const [adPositions, total] = await queryBuilder.getManyAndCount();

        return new PaginationResult(adPositions, total, perPage);
    }
}
