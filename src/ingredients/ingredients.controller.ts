import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { DeleteMultipleIngredientsDto } from './dto/delete-multiple-ingredients.dto';
import { ReadIngredientDto } from './dto/read-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientsService } from './ingredients.service';
import { IngredientPaginationPipe } from './pipes/ingredient-pagination.pipe';

@Controller('ingredients')
export class IngredientsController {
    constructor(private readonly ingredientsService: IngredientsService) {}

    @Get()
    async paginate(@Query(IngredientPaginationPipe) options: any): Promise<PaginationResult<ReadIngredientDto>> {
        return (await this.ingredientsService.paginate(options)).toClass(ReadIngredientDto);
    }

    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('icon'), new FileToBodyInterceptor('icon'))
    async create(@Body() createIngredientDto: CreateIngredientDto): Promise<ReadIngredientDto> {
        return plainToClass(ReadIngredientDto, await this.ingredientsService.create(createIngredientDto));
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ReadIngredientDto> {
        return plainToInstance(ReadIngredientDto, await this.ingredientsService.findOne(+id));
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('icon'), new FileToBodyInterceptor('icon'), new ParamsToBodyInterceptor({ id: 'id' }))
    async update(@Body() updateIngredientDto: UpdateIngredientDto): Promise<ReadIngredientDto> {
        return plainToClass(ReadIngredientDto, await this.ingredientsService.update(updateIngredientDto));
    }

    @Delete(':id(\\d+)')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async delete(@Param('id') id: string): Promise<void> {
        await this.ingredientsService.delete(+id);
    }

    @Delete('multiple')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteMultiple(@Body() deleteMultipleIngredientsDto: DeleteMultipleIngredientsDto): Promise<void> {
        await this.ingredientsService.deleteMultiple(deleteMultipleIngredientsDto);
    }
}
