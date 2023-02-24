import { Controller, Get, Query } from '@nestjs/common';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { ReadOccupationDto } from './dto/read-occupation.dto';
import { OccupationsService } from './occupations.service';

@Controller('occupations')
export class OccupationsController {
    constructor(private readonly occupationsService: OccupationsService) {}

    @Get()
    async paginate(@Query(PaginationPipe) options: any): Promise<PaginationResult<ReadOccupationDto>> {
        return (await this.occupationsService.paginate(options)).toClass(ReadOccupationDto);
    }
}
