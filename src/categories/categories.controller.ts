import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DeleteMultipleCategoriesDto } from './dto/delete-multiple-categories.dto';
import { ReadCategoryDto } from './dto/read-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryPaginationPipe } from './pipes/category-pagination.pipe';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    async paginate(@Query(CategoryPaginationPipe) options: any): Promise<PaginationResult<ReadCategoryDto>> {
        return (await this.categoriesService.paginate(options)).toClass(ReadCategoryDto);
    }

    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'banner', maxCount: 1},
        {name: 'logo', maxCount: 1},
    ]))
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @UploadedFiles() images
    ): Promise<ReadCategoryDto> {
        return plainToClass(ReadCategoryDto, await this.categoriesService.create(createCategoryDto, {
            banner: images?.banner?.[0]?.path,
            appLogo: images?.logo?.[0]?.path,
        }));
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ReadCategoryDto> {
      return plainToClass(ReadCategoryDto, await this.categoriesService.findOne(+id));
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'banner', maxCount: 1},
        {name: 'logo', maxCount: 1},
    ]), new ParamsToBodyInterceptor({id: 'id'}))
    async update(
        @Body() updateCategoryDto: UpdateCategoryDto,
        @UploadedFiles() images
    ): Promise<ReadCategoryDto> {
        return plainToClass(ReadCategoryDto, await this.categoriesService.update(updateCategoryDto, {
            banner: images?.banner?.[0]?.path,
            appLogo: images?.logo?.[0]?.path,
        }));
    }

    @Delete(':id(\\d+)')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string): Promise<void> {
      await this.categoriesService.delete(+id);
    }

    @Delete('multiple')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteMultiple(@Body() deleteMultipleCategoriesDto: DeleteMultipleCategoriesDto): Promise<void> {
        await this.categoriesService.deleteMultiple(deleteMultipleCategoriesDto);
    }
}
