import { Controller, Get, Query } from '@nestjs/common';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { ReadRecipeDifficultyDto } from './dto/read-recipe-difficulty.dto';
import { RecipeDifficultiesService } from './recipe-difficulties.service';

@Controller('recipe-difficulties')
export class RecipeDifficultiesController {
    constructor(private readonly recipeDifficultiesService: RecipeDifficultiesService) {}

    @Get()
    async paginate(@Query(PaginationPipe) options: any): Promise<PaginationResult<ReadRecipeDifficultyDto>> {
        return (await this.recipeDifficultiesService.paginate(options)).toClass(ReadRecipeDifficultyDto);
    }
}
