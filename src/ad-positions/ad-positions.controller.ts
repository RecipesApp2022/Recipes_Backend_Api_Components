import { Controller, Get, Query } from '@nestjs/common';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { AdPositionsService } from './ad-positions.service';
import { AdPosition } from './entities/ad-position.entity';

@Controller('ad-positions')
export class AdPositionsController {
    constructor(private readonly adPositions: AdPositionsService) {}

    @Get()
    async paginate(@Query(PaginationPipe) options: any): Promise<PaginationResult<AdPosition>> {
        return this.adPositions.paginate(options);
    }
}
