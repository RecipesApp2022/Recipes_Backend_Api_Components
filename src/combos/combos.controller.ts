import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AllowAny } from 'src/support/custom-decorators/allow-any';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { SellerIdToBodyInterceptor } from 'src/support/interceptors/seller-id-to-body.interceptor';
import { SlugifierInterceptor } from 'src/support/interceptors/slugifier.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { CombosService } from './combos.service';
import { CreateComboImageDto } from './dto/create-combo-image-dto';
import { CreateComboDto } from './dto/create-combo.dto';
import { DeleteComboImageDto } from './dto/delete-combo-image.dto';
import { DeleteComboDto } from './dto/delete-combo.dto';
import { DeleteMultipleCombosDto } from './dto/delete-multiple-combos.dto';
import { ReadComboDto } from './dto/read-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { ComboImage } from './entities/combo-image.entity';
import { ComboPaginationPipe } from './pipes/combo-pagination.pipe';

@Controller('combos')
export class CombosController {
    constructor(private readonly combosService: CombosService) {}

    @Get()
    @AllowAny()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
    async paginate(
        @Query(ComboPaginationPipe) options: any,
        @Body('clientId') clientId: string
    ): Promise<PaginationResult<ReadComboDto>> {
        return (await this.combosService.paginate(options, +clientId)).toClass(ReadComboDto);
    }

    @Post()
    @Roles(Role.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FilesInterceptor('images'), SellerIdToBodyInterceptor, new SlugifierInterceptor({ name: 'slug' }))
    async create(@Body() createComboDto: CreateComboDto, @UploadedFiles() images: Express.Multer.File[]): Promise<ReadComboDto> {
        return plainToClass(ReadComboDto, await this.combosService.create(createComboDto, images));
    }

    @Get(':id(\\d+)')
    @AllowAny()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
    async findOneById(
        @Param('id') id: string,
        @Body('clientId') clientId: string
    ): Promise<ReadComboDto> {
        return plainToClass(ReadComboDto, await this.combosService.findOne(+id, false, +clientId));
    }

    @Get(':slug')
    @AllowAny()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
    async findOneBySlug(
        @Param('slug') slug: string,
        @Body('clientId') clientId: string
    ): Promise<ReadComboDto> {
        return plainToClass(ReadComboDto, await this.combosService.findOne(slug, true, +clientId));
    }

    @Put(':id')
    @Roles(Role.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(SellerIdToBodyInterceptor, new ParamsToBodyInterceptor({ id: 'id' }))
    async update(@Body() updateComboDto: UpdateComboDto): Promise<ReadComboDto> {
        return plainToClass(ReadComboDto, await this.combosService.update(updateComboDto));
    }

    @Delete(':id(\\d+)')
    @Roles(Role.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(SellerIdToBodyInterceptor, new ParamsToBodyInterceptor({ id: 'id' }))
    async delete(@Body() deleteComboDto: DeleteComboDto): Promise<void> {
        await this.combosService.delete(deleteComboDto);
    }

    @Delete('multiple')
    @Roles(Role.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteMultiple(@Body() deleteMultipleCombosDto: DeleteMultipleCombosDto): Promise<void> {
        await this.combosService.deleteMultiple(deleteMultipleCombosDto);
    }

    @Post(':id/images')
    @Roles(Role.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new ParamsToBodyInterceptor({id: 'id'}), SellerIdToBodyInterceptor)
    async createComboImage(@Body() createComboImageDto: CreateComboImageDto): Promise<ComboImage> {
        return await this.combosService.createComboImage(createComboImageDto);
    }

    @Delete(':id/images/:imageId')
    @Roles(Role.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(SellerIdToBodyInterceptor, new ParamsToBodyInterceptor({id: 'id', imageId: 'imageId'}))
    async deleteComboImage(@Body() deleteComboImageDto: DeleteComboImageDto): Promise<void> {
        await this.combosService.deleteComboImage(deleteComboImageDto);
    }
}
