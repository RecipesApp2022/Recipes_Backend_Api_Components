import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { MeasurementUnit } from './entities/measurement-unit.entity';

@Injectable()
export class MeasurementUnitsService {
    constructor(@InjectRepository(MeasurementUnit) private readonly measurementUnitsRepository: Repository<MeasurementUnit>) {}

    async paginate({perPage, offset}: PaginationOptions): Promise<PaginationResult<MeasurementUnit>> {
        const queryBuilder = this.measurementUnitsRepository.createQueryBuilder('measurementUnit')
            .take(perPage)
            .skip(offset);

        const [measurementUnits, total] = await queryBuilder.getManyAndCount();

        return new PaginationResult(measurementUnits, total, perPage);
    }
}
