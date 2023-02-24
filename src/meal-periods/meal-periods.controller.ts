import { Controller, Get, Query } from '@nestjs/common';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { ReadMealPeriodDto } from './dto/read-meal-period.dto';
import { MealPeriodsService } from './meal-periods.service';

@Controller('meal-periods')
export class MealPeriodsController {
    constructor(private readonly mealPeriodsService: MealPeriodsService) {}

    @Get()
    async paginate(@Query(PaginationPipe) options: any): Promise<PaginationResult<ReadMealPeriodDto>> {
        return (await this.mealPeriodsService.paginate(options)).toClass(ReadMealPeriodDto);
    }
}
