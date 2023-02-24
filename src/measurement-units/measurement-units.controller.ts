import { Controller, Get, Query } from '@nestjs/common';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { ReadMeasurementUnitDto } from './dto/read-measurement-unit.dto';
import { MeasurementUnitsService } from './measurement-units.service';

@Controller('measurement-units')
export class MeasurementUnitsController {
    constructor(private readonly measurementUnitsService: MeasurementUnitsService) {}

    @Get()
    async paginate(@Query(PaginationPipe) options: any): Promise<PaginationResult<ReadMeasurementUnitDto>> {
        return (await this.measurementUnitsService.paginate(options)).toClass(ReadMeasurementUnitDto);
    }
}
