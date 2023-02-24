import { Controller, Get, Query } from '@nestjs/common';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { ReadIngredientTypeDto } from './dto/read-ingredient-type.dto';
import { IngredientTypesService } from './ingredient-types.service';
import { IngredientTypePaginationPipe } from './pipes/ingredient-type-pagination.pipe';

@Controller('ingredient-types')
export class IngredientTypesController {
    constructor(private readonly ingredientTypesService: IngredientTypesService) {}

    @Get()
    async paginate(@Query(IngredientTypePaginationPipe) options: any): Promise<PaginationResult<ReadIngredientTypeDto>> {
        return (await this.ingredientTypesService.paginate(options)).toClass(ReadIngredientTypeDto);
    }
}
